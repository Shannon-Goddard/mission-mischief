#!/usr/bin/env python3
"""
Login-based scraper for Instagram/Facebook
Perfect for once-daily scraping with real credentials
"""

from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
import boto3
import json
import time
from datetime import datetime

class LoginScraper:
    def __init__(self):
        self.ssm = boto3.client('ssm', region_name='us-east-1')
        self.chrome_options = Options()
        self.chrome_options.add_argument('--no-sandbox')
        self.chrome_options.add_argument('--disable-dev-shm-usage')
        # Remove headless for login (can add back after login)
        
    def get_credentials(self, platform):
        """Get login credentials from AWS Parameter Store"""
        try:
            username = self.ssm.get_parameter(Name=f'/mission-mischief/{platform}/email', WithDecryption=True)['Parameter']['Value']
            password = self.ssm.get_parameter(Name=f'/mission-mischief/{platform}/password', WithDecryption=True)['Parameter']['Value']
            return username, password
        except Exception as e:
            print(f"❌ Failed to get {platform} credentials: {e}")
            return None, None
    
    def login_instagram(self, driver):
        """Login to Instagram"""
        try:
            username, password = self.get_credentials('instagram')
            if not username or not password:
                return False
                
            driver.get('https://www.instagram.com/accounts/login/')
            time.sleep(3)
            
            # Enter credentials
            driver.find_element(By.NAME, 'username').send_keys(username)
            driver.find_element(By.NAME, 'password').send_keys(password)
            driver.find_element(By.XPATH, '//button[@type="submit"]').click()
            time.sleep(5)
            
            # Handle "Save Login Info" popup
            try:
                driver.find_element(By.XPATH, '//button[contains(text(), "Not Now")]').click()
                time.sleep(2)
            except:
                pass
                
            # Handle notifications popup
            try:
                driver.find_element(By.XPATH, '//button[contains(text(), "Not Now")]').click()
                time.sleep(2)
            except:
                pass
                
            return 'instagram.com' in driver.current_url and 'login' not in driver.current_url
            
        except Exception as e:
            print(f"❌ Instagram login failed: {e}")
            return False
    
    def login_facebook(self, driver):
        """Login to Facebook"""
        try:
            username, password = self.get_credentials('facebook')
            if not username or not password:
                return False
                
            driver.get('https://www.facebook.com/login')
            time.sleep(3)
            
            # Enter credentials
            driver.find_element(By.ID, 'email').send_keys(username)
            driver.find_element(By.ID, 'pass').send_keys(password)
            driver.find_element(By.NAME, 'login').click()
            time.sleep(5)
            
            return 'facebook.com' in driver.current_url and 'login' not in driver.current_url
            
        except Exception as e:
            print(f"❌ Facebook login failed: {e}")
            return False
    
    def scrape_instagram_hashtag(self, hashtag):
        """Scrape Instagram hashtag with login"""
        driver = webdriver.Chrome(options=self.chrome_options)
        posts = []
        
        try:
            print(f"📸 Login scraper: Instagram #{hashtag}")
            
            if self.login_instagram(driver):
                print("✅ Instagram login successful")
                
                # Navigate to hashtag page
                driver.get(f'https://www.instagram.com/explore/tags/{hashtag}/')
                time.sleep(5)
                
                # Scroll to load more posts
                driver.execute_script("window.scrollTo(0, 1000);")
                time.sleep(3)
                
                # Find posts
                post_links = driver.find_elements(By.CSS_SELECTOR, 'article a')[:20]
                
                for link in post_links[:5]:  # Limit to 5 posts for daily scraping
                    try:
                        href = link.get_attribute('href')
                        driver.execute_script("window.open(arguments[0]);", href)
                        driver.switch_to.window(driver.window_handles[1])
                        time.sleep(3)
                        
                        # Extract caption
                        try:
                            caption_elements = driver.find_elements(By.CSS_SELECTOR, '[data-testid="post-caption"] span, h1 + div span')
                            for element in caption_elements:
                                text = element.text.lower()
                                if 'missionmischief' in text:
                                    posts.append({
                                        'text': text,
                                        'platform': 'instagram',
                                        'url': href
                                    })
                                    print(f"📸 Found: {text[:50]}...")
                                    break
                        except:
                            pass
                        
                        driver.close()
                        driver.switch_to.window(driver.window_handles[0])
                        
                    except Exception as e:
                        print(f"❌ Error processing Instagram post: {e}")
                        continue
            else:
                print("❌ Instagram login failed")
                
        except Exception as e:
            print(f"❌ Instagram scraping error: {e}")
        finally:
            driver.quit()
            
        print(f"📸 Instagram: Found {len(posts)} posts")
        return posts
    
    def scrape_facebook_hashtag(self, hashtag):
        """Scrape Facebook hashtag with login"""
        driver = webdriver.Chrome(options=self.chrome_options)
        posts = []
        
        try:
            print(f"📘 Login scraper: Facebook #{hashtag}")
            
            if self.login_facebook(driver):
                print("✅ Facebook login successful")
                
                # Navigate to hashtag page
                driver.get(f'https://www.facebook.com/hashtag/{hashtag}')
                time.sleep(5)
                
                # Scroll to load posts
                driver.execute_script("window.scrollTo(0, 1000);")
                time.sleep(3)
                
                # Find posts
                post_elements = driver.find_elements(By.CSS_SELECTOR, '[data-testid="post_message"], [role="article"]')
                
                for element in post_elements[:10]:  # Limit to 10 posts
                    try:
                        text = element.text.lower()
                        if 'missionmischief' in text:
                            posts.append({
                                'text': text,
                                'platform': 'facebook'
                            })
                            print(f"📘 Found: {text[:50]}...")
                    except:
                        continue
            else:
                print("❌ Facebook login failed")
                
        except Exception as e:
            print(f"❌ Facebook scraping error: {e}")
        finally:
            driver.quit()
            
        print(f"📘 Facebook: Found {len(posts)} posts")
        return posts
    
    def parse_posts(self, posts):
        """Parse hashtag data from posts"""
        leaderboard = []
        geography = {}
        missions = {}
        
        for post in posts:
            import re
            text = post['text']
            platform = post['platform']
            
            # Extract user
            user_match = re.search(r'#missionmischiefuser([a-z0-9]+)', text) or re.search(r'#([a-z0-9]+)(?!missionmischief)', text)
            handle = f"@{user_match.group(1)}" if user_match else '@unknown'
            
            # Extract points
            points_match = re.search(r'#missionmischiefpoints(\d+)', text)
            points = int(points_match.group(1)) if points_match else 3
            
            # Extract location
            city_match = re.search(r'#missionmischiefcity([a-z]+)', text)
            state_match = re.search(r'#missionmischiefstate([a-z]+)', text)
            city = city_match.group(1).title() if city_match else 'Unknown'
            state = state_match.group(1).upper() if state_match else 'Unknown'
            
            # Add to leaderboard
            existing = next((p for p in leaderboard if p['handle'] == handle), None)
            if existing:
                existing['points'] += points
            else:
                leaderboard.append({'handle': handle, 'points': points, 'city': city, 'state': state})
            
            # Geography
            if state != 'Unknown' and city != 'Unknown':
                if state not in geography:
                    geography[state] = {}
                geography[state][city] = geography[state].get(city, 0) + 1
            
            # Missions
            mission_id = '5' if 'missionmischiefslimshady' in text else '7' if 'missionmischiefcoffee' in text else '1'
            if mission_id not in missions:
                missions[mission_id] = {'instagram': 0, 'facebook': 0, 'x': 0}
            missions[mission_id][platform] += 1
        
        return {
            'leaderboard': sorted(leaderboard, key=lambda x: x['points'], reverse=True),
            'geography': geography,
            'missions': missions,
            'justice': [],
            'lastUpdated': datetime.now().isoformat(),
            'source': 'login-scraper'
        }
    
    def login_twitter(self, driver):
        """Login to X/Twitter"""
        try:
            username, password = self.get_credentials('twitter')
            if not username or not password:
                return False
                
            driver.get('https://twitter.com/i/flow/login')
            time.sleep(3)
            
            # Enter email
            driver.find_element(By.NAME, 'text').send_keys(username)
            driver.find_element(By.XPATH, '//span[text()="Next"]').click()
            time.sleep(3)
            
            # Enter password
            driver.find_element(By.NAME, 'password').send_keys(password)
            driver.find_element(By.XPATH, '//span[text()="Log in"]').click()
            time.sleep(5)
            
            return 'twitter.com' in driver.current_url and 'login' not in driver.current_url
            
        except Exception as e:
            print(f"❌ Twitter login failed: {e}")
            return False
    
    def scrape_twitter_hashtag(self, hashtag):
        """Scrape Twitter hashtag with login"""
        driver = webdriver.Chrome(options=self.chrome_options)
        posts = []
        
        try:
            print(f"🐦 Login scraper: Twitter #{hashtag}")
            
            if self.login_twitter(driver):
                print("✅ Twitter login successful")
                
                # Navigate to hashtag search
                driver.get(f'https://twitter.com/hashtag/{hashtag}')
                time.sleep(5)
                
                # Scroll to load tweets
                driver.execute_script("window.scrollTo(0, 1000);")
                time.sleep(3)
                
                # Find tweets
                tweet_elements = driver.find_elements(By.CSS_SELECTOR, '[data-testid="tweetText"]')
                
                for element in tweet_elements[:10]:
                    try:
                        text = element.text.lower()
                        if 'missionmischief' in text:
                            posts.append({
                                'text': text,
                                'platform': 'x'
                            })
                            print(f"🐦 Found: {text[:50]}...")
                    except:
                        continue
            else:
                print("❌ Twitter login failed")
                
        except Exception as e:
            print(f"❌ Twitter scraping error: {e}")
        finally:
            driver.quit()
            
        print(f"🐦 Twitter: Found {len(posts)} posts")
        return posts
    
    def scrape_all_platforms(self):
        """Scrape all three platforms with login"""
        print("🔑 Login-based scraper starting...")
        
        instagram_posts = self.scrape_instagram_hashtag('missionmischief')
        facebook_posts = self.scrape_facebook_hashtag('missionmischief')
        twitter_posts = self.scrape_twitter_hashtag('missionmischief')
        
        all_posts = instagram_posts + facebook_posts + twitter_posts
        
        if not all_posts:
            print("❌ No posts found with login scraper")
            return None
            
        result = self.parse_posts(all_posts)
        print(f"✅ Login scraper found {len(result['leaderboard'])} players")
        
        return result

if __name__ == '__main__':
    scraper = LoginScraper()
    result = scraper.scrape_all_platforms()
    if result:
        print(json.dumps(result, indent=2))