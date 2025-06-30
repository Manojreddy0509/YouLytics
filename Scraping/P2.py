import requests
def get_comments(video_id, api_key):
    all_comments = []  # To store all the comments
    url = "https://www.googleapis.com/youtube/v3/commentThreads"
    page_token = None  # Start with no token (first page)
    while True:
        # Prepare the parameters for the API request
        params = {
            "part": "snippet",
            "videoId": video_id,
            "maxResults": 100,
            "key": api_key
        }
        # If we have a page token, add it to the params
        if page_token:
            params["pageToken"] = page_token
        # Make the GET request to the API
        response = requests.get(url, params=params)
        data = response.json()
        # Loop through all items and extract comment text
        for item in data.get("items", []):
            comment_text = item["snippet"]["topLevelComment"]["snippet"]["textDisplay"]
            all_comments.append(comment_text)
            # Fetch replies if any
            reply_count = item["snippet"].get("totalReplyCount", 0)
            if reply_count > 0:
                comment_id = item["id"]
                reply_token = None
                while True:
                    reply_params = {
                        "part": "snippet",
                        "parentId": comment_id,
                        "key": api_key,
                        "maxResults": 100
                    }
                    if reply_token:
                        reply_params["pageToken"] = reply_token
                    reply_url = "https://www.googleapis.com/youtube/v3/comments"
                    reply_response = requests.get(reply_url, params=reply_params)
                    reply_data = reply_response.json()
                    for reply_item in reply_data.get("items", []):
                        reply_text = reply_item["snippet"]["textDisplay"]
                        all_comments.append(reply_text)
                    reply_token = reply_data.get("nextPageToken")
                    if not reply_token:
                        break
        # Check if there is a next page
        page_token = data.get("nextPageToken")
        if not page_token:
            break  # No more pages, exit the loop
    return all_comments
    print(f"Total comments fetched: {len(all_comments)}")
get_comments("7a14teGcv48", "API KEY")
