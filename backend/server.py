from flask import Flask, request, jsonify
import subprocess
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

@app.route('/execute', methods=['POST'])
def execute_code():
    data = request.json
    code = data.get('code', '')
    language = data.get('language', '')

    try:
        if language == 'python':
            process = subprocess.run(
                ['python3', '-c', code],
                capture_output=True,
                text=True,
                check=True
            )
        elif language == 'c':
            with open('main.c', 'w') as f:
                f.write(code)
            subprocess.run(['gcc', 'main.c', '-o', 'main'], check=True)
            process = subprocess.run(['./main'], capture_output=True, text=True, check=True)
        elif language == 'cpp':
            with open('main.cpp', 'w') as f:
                f.write(code)
            subprocess.run(['g++', 'main.cpp', '-o', 'main'], check=True)
            process = subprocess.run(['./main'], capture_output=True, text=True, check=True)
        elif language == 'java':
            with open('Main.java', 'w') as f:
                f.write(code)
            subprocess.run(['javac', 'Main.java'], check=True)
            process = subprocess.run(['java', 'Main'], capture_output=True, text=True, check=True)
        elif language == 'php':
            with open('main.php', 'w') as f:
                f.write(code)
            process = subprocess.run(['php', 'main.php'], capture_output=True, text=True, check=True)
        else:
            return jsonify({'error': f'Unsupported language: {language}'}), 400

        return jsonify({'output': process.stdout})
    except subprocess.CalledProcessError as e:
        return jsonify({'error': e.stderr}), 400

if __name__ == '__main__':
    app.run(debug=True)
