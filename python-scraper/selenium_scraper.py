#!/usr/bin/env python3
"""
Mission Mischief Selenium Auto-Scraper
Runs when Lambda returns 0 Instagram/Facebook data
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
import json
import re
import time
from datetime import datetime
import schedule
import threading

class SeleniumScraper:
    def __init__(self):
        self.chrome_options = Options()
        self.chrome_options.add_argument('--headless')  # Run in background
        self.chrome_options.add_argument('--no-sandbox')
        self.chrome_options.add_argument('--disable-dev-shm-usage')
        
    def scrape_instagram_hashtag(self, hashtag):
        """Scrape Instagram hashtag posts"""
        driver = webdriver.Chrome(options=self.chrome_options)
        posts = []
        
        try:
            url = f'https://www.instagram.com/explore/tags/{hashtag}/'
            driver.get(url)
            time.sleep(3)
            
            # Find recent posts
            post_links = driver.find_elements(By.CSS_SELECTOR, 'article a')[:20]
            
            for link in post_links:
                try:
                    href = link.get_attribute('href')
                    driver.execute_script("window.open(arguments[0]);", href)
                    driver.switch_to.window(driver.window_handles[1])
                    time.sleep(2)
                    
                    # Extract post text
                    try:
                        caption_element = driver.find_element(By.CSS_SELECTOR, '[data-testid="post-caption"] span')
                        caption = caption_element.text.lower()
                        
                        if 'missionmischief' in caption:
                            posts.append({
                                'text': caption,
                                'platform': 'instagram',
                                'url': href
                            })
                    except:
                        pass
                    
                    driver.close()
                    driver.switch_to.window(driver.window_handles[0])
                    
                except Exception as e:
                    print(f"Error processing post: {e}")
                    continue
                    
        except Exception as e:
            print(f"Instagram scraping error: {e}")
        finally:
            driver.quit()
            
        return posts
    
    def scrape_facebook_hashtag(self, hashtag):
        """Scrape Facebook hashtag posts"""
        driver = webdriver.Chrome(options=self.chrome_options)
        posts = []
        
        try:
            url = f'https://www.facebook.com/hashtag/{hashtag}'
            driver.get(url)
            time.sleep(5)
            
            # Scroll to load posts
            driver.execute_script("window.scrollTo(0, 1000);")
            time.sleep(3)
            
            # Find posts containing mission mischief hashtags
            post_elements = driver.find_elements(By.CSS_SELECTOR, '[data-testid="post_message"]')
            
            for element in post_elements:
                try:
                    text = element.text.lower()
                    if 'missionmischief' in text:
                        posts.append({
                            'text': text,
                            'platform': 'facebook'
                        })
                except:
                    continue
                    
        except Exception as e:
            print(f"Facebook scraping error: {e}")
        finally:
            driver.quit()
            
        return posts
    
    def parse_hashtag_data(self, posts):
        """Parse Mission Mischief hashtag data from posts"""
        leaderboard = []
        geography = {}
        missions = {}
        
        for post in posts:
            text = post['text']
            platform = post['platform']
            
            # Extract username
            user_match = re.search(r'#missionmischiefuser([a-z0-9]+)', text)
            if not user_match:
                user_match = re.search(r'#([a-z0-9]+)(?!missionmischief)', text)
            
            handle = user_match.group(1) if user_match else 'unknown'
            
            # Extract points
            points_match = re.search(r'#missionmischiefpoints(\d+)', text)
            points = int(points_match.group(1)) if points_match else 1
            
            # Extract location
            city_match = re.search(r'#missionmischiefcity([a-z]+)', text)
            state_match = re.search(r'#missionmischiefstate([a-z]+)', text)
            
            city = city_match.group(1).title() if city_match else 'Unknown'
            state = state_match.group(1).upper() if state_match else 'Unknown'
            
            # Add to leaderboard
            existing = next((p for p in leaderboard if p['handle'] == f'@{handle}'), None)
            if existing:
                existing['points'] += points
            else:
                leaderboard.append({
                    'handle': f'@{handle}',
                    'points': points,
                    'city': city,
                    'state': state
                })
            
            # Track geography
            if state != 'Unknown' and city != 'Unknown':
                if state not in geography:
                    geography[state] = {}
                geography[state][city] = geography[state].get(city, 0) + 1
            
            # Track missions
            mission_id = '5'  # Default
            if 'missionmischiefslimshady' in text:
                mission_id = '5'
            elif 'missionmischiefcoffee' in text:
                mission_id = '7'
            
            if mission_id not in missions:
                missions[mission_id] = {'instagram': 0, 'facebook': 0, 'x': 0}
            missions[mission_id][platform] += 1
        
        return {
            'leaderboard': sorted(leaderboard, key=lambda x: x['points'], reverse=True),
            'geography': geography,
            'missions': missions,
            'justice': [],
            'lastUpdated': datetime.now().isoformat(),
            'source': 'selenium'
        }
    
    def scrape_all_platforms(self):
        """Scrape Instagram and Facebook for Mission Mischief data"""
        print("🔍 Selenium scraper starting...")
        
        # Scrape both platforms
        instagram_posts = self.scrape_instagram_hashtag('missionmischief')
        facebook_posts = self.scrape_facebook_hashtag('missionmischief')
        
        all_posts = instagram_posts + facebook_posts
        
        if not all_posts:
            print("❌ No posts found")
            return None
            
        # Parse hashtag data
        result = self.parse_hashtag_data(all_posts)
        print(f"✅ Selenium found {len(result['leaderboard'])} players")
        
        return result

def run_selenium_backup():
    """Function to run Selenium scraper"""
    scraper = SeleniumScraper()
    return scraper.scrape_all_platforms()

def schedule_daily_scraping():
    """Schedule Selenium to run daily at 3:30 AM (30 min after Lambda)"""
    schedule.every().day.at("03:30").do(run_selenium_backup)
    
    while True:
        schedule.run_pending()
        time.sleep(60)

if __name__ == '__main__':
    # Test run
    result = run_selenium_backup()
    if result:
        print(json.dumps(result, indent=2))