from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import random
import requests
from bs4 import BeautifulSoup

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with specific origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

WARM_WORDS = [
    # Classic
    "May your days be merry and bright!",
    "Wishing you peace, love, and joy this holiday season.",
    "Sending you warm wishes for a wonderful Christmas.",
    "May the magic of Christmas fill your heart with happiness.",
    "Hope your holiday season is full of fun and laughter.",
    "Wishing you a season that’s merry and bright with the light of God’s love.",
    "May the spirit of Christmas be with you all year round.",
    "Sending you love and warmth this festive season.",
    "May your home be filled with the joy of the Christmas season.",
    "Wishing you a Christmas full of love and happy memories.",
    
    # Heartfelt
    "May the melody and spirit of the holidays fill your home with love and peace.",
    "Wishing you a season of blessings from heaven above.",
    "May your Christmas sparkle with moments of love, laughter and goodwill.",
    "Here’s to a year of blessings and beyond. Have a Merry Christmas!",
    "May the Christmas season bring only happiness and joy to you and your family.",
    "The gift of love. The gift of peace. The gift of happiness. May all these be yours at Christmas.",
    "Wishing you a Christmas that's merry and bright!",
    "May your world be filled with warmth and good cheer this Holy season, and throughout the year.",
    "Count your blessings, sing your Christmas carols, open your gifts, and make a wish under the Christmas tree.",
    "May the closeness of friends, the comfort of home, and the unity of our nation, renew your spirits this festive season.",
    
    # Short & Sweet
    "Merry Christmas!",
    "Happy holidays!",
    "Wishing you joy and peace.",
    "Warm holiday wishes.",
    "Season’s greetings!",
    "Peace, love, and joy.",
    "Cheers to the season.",
    
    # Funny
    "Christmas calories don’t count—enjoy!",
    "Sleigh my name, sleigh my name.",
    "Dear Santa: Define 'nice'.",
    "Wishing you a white Christmas… and if the white runs out, pour the red.",
    "Have an ice Christmas!",
    "All I want for Christmas is naps and snacks.",
    "Merry Christmas from your favorite holiday overachievers.",
    
    # Religious
    "Wishing you a Christmas filled with the peace and joy of Christ.",
    "May the true spirit of Christmas shine in your heart and light your path.",
    "Glory to God in the highest, and on earth peace, good will toward men. Merry Christmas!",
    "May God’s love fill your home this Christmas and always.",
    "Blessings to you and your family this Christmas season."
]

@app.get("/")
def read_root():
    return {"Hello": "World"}

@app.get("/warm-word-static")
def get_warm_word():
    return {"word": random.choice(WARM_WORDS)}

@app.get("/warm-word")
def get_warm_word_online():
    """
    Demonstrates how to fetch a wish from an online source.
    Attempts to fetch a quote from ZenQuotes API.
    """
    try:
        # ZenQuotes API (Free tier)
        # verify=False is used here to bypass potential local SSL certificate issues
        response = requests.get("https://zenquotes.io/api/random", timeout=3, verify=False)
        if response.status_code == 200:
            data = response.json()
            if isinstance(data, list) and len(data) > 0:
                quote = data[0]
                return {"word": f"{quote['q']}"}
    except Exception as e:
        print(f"Online fetch failed: {e}")
    
    # Fallback to local list if online fetch fails
    return {"word": random.choice(WARM_WORDS)}

@app.get("/items/{item_id}")
def read_item(item_id: int, q: str = None):
    return {"item_id": item_id, "q": q}
