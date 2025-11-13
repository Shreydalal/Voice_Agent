from flask import Flask, request, jsonify, make_response
import os
import requests

app = Flask(__name__)

# CORS headers
def add_cors_headers(response):
    response.headers['Access-Control-Allow-Origin'] = '*'
    response.headers['Access-Control-Allow-Headers'] = 'authorization, x-client-info, apikey, content-type'
    return response

@app.after_request
def after_request(response):
    return add_cors_headers(response)

@app.route('/elevenlabs-conversation', methods=['POST', 'OPTIONS'])
def elevenlabs_conversation():
    if request.method == 'OPTIONS':
        return add_cors_headers(make_response())

    try:
        ELEVENLABS_API_KEY = os.getenv('ELEVENLABS_API_KEY')
        if not ELEVENLABS_API_KEY:
            raise ValueError('ELEVENLABS_API_KEY is not configured')

        data = request.get_json()
        action = data.get('action')
        agent_id = data.get('agentId')

        if action == 'get_signed_url':
            # Get signed URL for conversation
            url = f"https://api.elevenlabs.io/v1/convai/conversation/get_signed_url?agent_id={agent_id}"
            headers = {
                'xi-api-key': ELEVENLABS_API_KEY
            }

            response = requests.get(url, headers=headers)

            if response.status_code != 200:
                error_message = response.text
                app.logger.error('ElevenLabs API error: %s', error_message)
                return jsonify({'error': f'Failed to get signed URL: {response.status_code}'}), 500

            return jsonify(response.json())

        return jsonify({'error': 'Invalid action'}), 400

    except Exception as e:
        app.logger.error('Error in elevenlabs-conversation: %s', str(e))
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    app.run(debug=True)