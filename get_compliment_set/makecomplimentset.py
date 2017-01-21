import praw

#reddit account us /u/BaronOBullets
#pass is HackTheWorldThisIsAmericaBaby


instance = praw.Reddit(\
client_id='ru1yiiBSUuOqaw',\
client_secret="dVHE9aZQ1wfLKE98VI2ZEJ-dEKU", password='HackTheWorldThisIsAmericaBaby',\
user_agent='BaronOBullets', username='BaronOBullets')

sub = instance.subreddit('FreeCompliments')
dat = sub.parse
for post in sub.hot(limit=5):
	for top_level_comment in post.comments:
		print(top_level_comment.body)
