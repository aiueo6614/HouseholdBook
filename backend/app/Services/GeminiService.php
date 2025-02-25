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
        $this->apiKey = config('services.gemini.api_key');
        $this->client = new Client();
    }

    public function gemini($image)
    {
        $url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=' . $this->apiKey;
        $json = json_encode([
            'system_instruction' => [
                'parts' => [
                    'text' => 'レシートの写真から商品名と金額をMD無しで以下のJSON形式で返答{"results":[{"product":str,"amount":int},{"product":str,"amount":int},...]}'
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

        Log::debug('Gemini response >' . $geminiResponse->getBody());

        return json_decode($geminiResponse->getBody(), true);
    }
}
