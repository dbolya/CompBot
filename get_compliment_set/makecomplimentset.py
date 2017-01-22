import praw

#reddit account us /u/BaronOBullets
#pass is HackTheWorldThisIsAmericaBaby


instance = praw.Reddit(\
client_id='ru1yiiBSUuOqaw',\
client_secret="dVHE9aZQ1wfLKE98VI2ZEJ-dEKU", password='HackTheWorldThisIsAmericaBaby',\
user_agent='BaronOBullets', username='BaronOBullets')

compFile = open("todayilearned_top.txt", 'w+')

badstuff = ["http", ".com", "imgur", "r/", "reddit", "+", "*", "-", "photo", "pic", "selfie", "hell", "shit", "damn", "fuck", "ass", "cunt", "edit", "sexy", "porn", "boob", "tit", "(", ")", "[", "]", "rack", "pussy", "\"", "\'", "autis", "butt", "weed", "bake", "420", "bastard", "roast", "link", "report", "sub", "fag", "fgt", "retard", "mongoloid", "nig", "m9", "two", "couple", "each", "wrote", "title", "post", "submission", "karma", "upvot", "downvot", "op", "thank", "sex", "bitch", "compliment", "thumbnail", "background", "btw", "everyone", "u/", "toast", "username"]
badstarters = ["also", "and", "but"] # Hide the fact that this is taken from a reddit thread :^)


def filterPost(submission):
	if( (submission.link_flair_text is None or submission.link_flair_text.lower() == "selfie" or submission.score > 2) and (not "official" in submission.title.lower()) ):
		return True
	return False

def filterComment(comment,submission):
	lowercase = comment.body.lower();
	if(comment.body == "[deleted]" or comment.author.name == submission.author.name or len(lowercase) < 16 or len(lowercase) > 256 or comment.score < 3 or comment.body.strip() == ""):
		return False
	
	for st in badstarters:
		if(lowercase.startswith(st)):
			return False
	for st in badstuff:
		if(st in lowercase):
			return False
	if(submission.author.name.lower() in lowercase):
		return False
	
	return True
	
badstuffTIL = ["shit", "damn", "fuck", "ass", "cunt", "sexy", "porn", "boob", "pussy", "weed", "bake", "420", "bastard", "sub", "fag", "retard", "each", "sex", "bitch", "u/", "toast"]
	
def filterTIL(submission):
	lowercase = submission.title.lower();
	if( (not ("til" in lowercase or "today i learned" in lowercase) ) ):
		return False
	for st in badstuffTIL:
		if(st in lowercase):
			return False
	
	return True
	
endingpunctuation = [".","!","?"]
def processAndSubmitComment(comment):
	nString = comment.strip()
	hasEndingP = False
	for p in endingpunctuation:
		if(nString.endswith(p)):
			hasEndingP = True
	if(hasEndingP == False):
		nString += "."
	nString = nString.replace("\n", " ")
	
	nString = nString[:1].upper() + nString[1:]
		
	compFile.write(nString + "\n")
	print(nString)
	
def processAndSubmitTIL(post):
	nString = post.strip()
	hasEndingP = False
	for p in endingpunctuation:
		if(nString.endswith(p)):
			hasEndingP = True
	if(hasEndingP == False):
		nString += "."
	nString = nString.replace("\n", " ")
	
	nString = nString[:1].upper() + nString[1:]
	
	nString = nString.replace("TIL", "Did you know")
			
	nString = nString.replace('.', '?', 1)
		
	compFile.write(nString + "\n")
	print(nString)
	

'''	
sub = instance.subreddit('ToastMe')
dat = sub.parse

modulo = 0

for post in sub.top(limit=500):
	modulo += 1
	if(modulo % 10 == 0):
		compFile.flush()
	if filterPost(post) == False:
		continue
	try:
		for top_level_comment in post.comments:
			try:
				if(filterComment(top_level_comment, post) == False): 
					continue
				processAndSubmitComment(top_level_comment.body)
			except:
				print("error parsing comment, skipping")
	except:
		print("error parsing post, skipping")
'''

sub = instance.subreddit('TodayILearned')

modulo = 0
count=0
for post in sub.top(limit=1000):
	modulo += 1
	if(modulo % 10 == 0):
		compFile.flush()
	try:
		if filterTIL(post) == False:
			continue
		else:
			count+=1
			processAndSubmitTIL(post.title);
	except:
		print("error parsing post, skipping")
print(count)
