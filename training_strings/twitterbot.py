import html
from twython import Twython
from twython import TwythonError

def getTweets(handle):
    """Returns list of tweets"""

    try:
        app = Twython('EIULTBuVR8QSG8ZUo90hRemIb', 'wA7CggtcGsm89PBCbFatFiwvtO6ed26rIOc4oYmESRpbLMTYOK')
        user = app.lookup_user(screen_name=handle)
        tweets = app.get_user_timeline(screen_name=handle, count=1000)
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

getTweets('TheNiceBot')
