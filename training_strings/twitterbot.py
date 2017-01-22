import html
from twython import Twython
from twython import TwythonError

def getTweets(handle):
    """Returns list of tweets"""

    try:
        app = Twython('EIULTBuVR8QSG8ZUo90hRemIb', 'wA7CggtcGsm89PBCbFatFiwvtO6ed26rIOc4oYmESRpbLMTYOK')
        user = app.lookup_user(screen_name=handle)
        lastid=[808037199191166976]
        tweets = []
        for i in range(16):
            a=app.get_user_timeline(screen_name=handle, count=200, max_id=lastid[-1])
            tweets=tweets+a
            lastid.append(a[-1]['id'])

        list_of_tweets=[html.unescape(tweet["text"].replace("\n", " ")) for tweet in tweets]

        file=open("twitterbot.txt","w")

        for tweet in list_of_tweets:
            words=tweet.split()
            newWords=words[:]
            for word in words:
                if word[0]=='@' or word[0]=='#':
                    newWords.remove(word)
            tweet=' '.join(newWords)
            file.write(tweet+'\n')

    except TwythonError:
        raise RuntimeError("error!") from None

def parseFile():
    file1=open("twitterbot.txt","r")
    file2=open("newfile.txt","w")
    list_of_tweets=[]
    for line in file1:
        if str(line) not in list_of_tweets:
            list_of_tweets.append(str(line))
    count=0
    for tweet in list_of_tweets:
        print(count)
        count+=1
        file2.write(tweet)

parseFile()
