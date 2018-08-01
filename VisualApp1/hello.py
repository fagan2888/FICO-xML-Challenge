from flask import Flask
from flask import request, jsonify, json
from flask import render_template
import pandas as pd
import numpy as np
from SVM_model import SVM_model
from Functions import *

np.random.seed(12345)
 
# ------ Helper functions ------- #

def display_data (sample):
	sample -= 1
	print(X[sample])
	if X[sample][0] == -9:
		category = "NA"
		return sample, 0, 0, category, -1
	else:
		good_percent = svm_model.run_model(X[sample])
		predicted = 0
		if good_percent>.5:
			predicted = 1
		ground_truth = y[sample]
		model_correct = 1
		if predicted != ground_truth:
			model_correct = 0
		category = "NN";
		if (predicted, model_correct) == (0,0):
			category = "FN"
		elif (predicted, model_correct) == (0,1):
			category = "TN"
		elif (predicted, model_correct) == (1,0):
			category = "FP"
		elif (predicted, model_correct) == (1,1):
			category = "TP"
		return sample, good_percent, model_correct, category, predicted

trans_dict = {}
def sample_transf ():
	my_count = 0
	for sample in range(10459):
		if X[sample][0] != -9:
			trans_dict[str(sample)] = my_count
			my_count += 1
		else:
			trans_dict[str(sample)] = -9

# ------ Initialize model ------- #

from ILE import instance_explanation, prepare_for_D3, divide_data_bins, scaling_data_density

vals = pd.read_csv("final_data_file.csv", header=None).values
X = vals[:,1:]
y = vals[:,0]

vals_no_9 = prepare_for_analysis("final_data_file.csv")
X_no_9 = vals_no_9[:,1:]

no_samples, no_features = X.shape

svm_model = SVM_model(None,"final_data_file.csv")
svm_model.train_model(0.001)
svm_model.test_model()

bins_centred, X_pos_array, init_vals = divide_data_bins(X_no_9,[9,10])
dict_array = scaling_data_density(X_no_9, bins_centred)
count_total = occurance_counter("pre_data1.csv")
sample_transf()

# ------ Initialize WebApp ------- #

app = Flask(__name__, static_folder="C:/Users/Oscar/Documents/UGR 2018/Fico-Challenge-master/VisualApp1/static")

@app.route('/')
def intro_site():
	return render_template("index_intro.html")

@app.route('/individual')
def ind_site():
    return render_template("index_individual.html")

@app.route('/glob_req')
def glob_site_bars():

	if request.method == 'GET':

		ret_arr = []
		arr = list (count_total)
		for item in arr:
			new_item = list(item)
			ret_arr.append(new_item)
		ret_string = json.dumps(ret_arr)

	return ret_string

@app.route('/global')
def glob_site():
	return render_template("index_global.html")

@app.route('/glob_feat', methods=['GET'])
def handle_request_rr():

	if request.method == 'GET':

		anchor = int(request.args.get('anchor'))
		change = int(request.args.get('change'))
		change_val = int(request.args.get('change_val'))

		changes = get_change_samples("pre_data1.csv","final_data_file.csv",8,-1)
		testing = prep_for_D3_global("pre_data1.csv","final_data_file.csv", changes, bins_centred, X_pos_array,trans_dict)

		## Parse values into python dictionary
		ret_string = json.dumps(testing[:13])

		return ret_string

@app.route('/first_panel', methods=['GET'])
def handle_request_ft():

	if request.method == 'GET':

		ft_list = (request.args.get('features'))
		ft_list = ft_list[1:-1].split(',')
		ft_list = [int(x) for x in ft_list]

		# FUNCTION TO GENERATE LIST OF COMBINATION AND RANK THEM

		combinations = combination_finder("pre_data1.csv",ft_list,False)

		ret_arr = []
		for combi in combinations[:15]:
			ret_arr.append(big_scraper("pre_data1.csv", combi))

		## Parse values into python dictionary
		ret_string = json.dumps(ret_arr)

		return ret_string

@app.route('/instance', methods=['GET'])
def handle_request():

	np.random.seed(12345)

	if request.method == 'GET':
		sample = -10
		try:
			sample = int(request.args.get('sample'))
		except:
			return "Please enter a sample number in the range (1, 10459)."

		if sample != -10:
			if sample<1 or sample>10459:
				return "Please enter a sample number in the range (1, 10459)."
			else:			
				
				sample, good_percent, model_correct, category, predicted = display_data(sample)
				
				### Run MSC and Anchors
				trans_sample = trans_dict[str(sample)]
				change_vector, change_row, anchors, percent = instance_explanation(svm_model, X_no_9, X_no_9[trans_sample], trans_sample, X_pos_array, bins_centred)

				### Parse values into python dictionary
				ret_string = ""
				data_array = prepare_for_D3(X[sample], bins_centred, change_row, change_vector, anchors, percent)

				for dct in data_array:
					ret_string += json.dumps(dct)
					ret_string += "~"
				for dct in dict_array:
					ret_string += json.dumps(dct)
					ret_string += "~"
				ret_string += json.dumps({'sample': sample+1, 'good_percent': good_percent, 'model_correct': model_correct, 'category': category, 'predicted': predicted, 'trans_sample': trans_sample})
				return ret_string

# ------ Run WebApp ------- #

if __name__ == '__main__':

	np.random.seed(12345)
	app.run(port=5005, debug=True)