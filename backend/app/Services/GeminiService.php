<?php

namespace App\Services;

use GuzzleHttp\Client;
use Illuminate\Support\Facades\Log;

class GeminiService
{
    private $apiKey;
    private $client;

    public function __construct()
    {
        $this->apiKey = config('services.google.gemini_api_key');
        $this->client = new Client();
    }

    public function gemini($image)
    {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' . $this->apiKey;
        $json = json_encode([
            'system_instruction' => [
                'parts' => [
                    'text' => 'レシートの写真から商品名と金額を以下のJSON形式で返答。{"results":[{"product":str,"amount":int},{"product":str,"amount":int},...]}'
                ]
            ],
            'contents' => [
                'parts' => [
                    ['text' => ''],
                    [
                        'inline_data' => [
                            'mime_type' => 'image/jpeg',
                            'data' => base64_encode($image)
                        ]
                    ]
                ]
            ]
        ]);

        $geminiResponse = $this->client->post($url, [
            'headers' => [
                'Content-Type' => 'application/json'
            ],
            'body' => $json
        ]);

        $geminiBody = json_decode($geminiResponse->getBody(), true);

        $geminiText = $geminiBody['candidates'][0]['content']['parts'][0]['text'];
        $geminiText = str_replace('JSON', '', $geminiText);
        $geminiText = str_replace('json', '', $geminiText);
        $geminiText = str_replace('```', '', $geminiText);

        return $geminiText;
    }
}
