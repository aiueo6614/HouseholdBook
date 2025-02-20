<?php

namespace App\Services;

use Google\Client;
use Google\Service\Drive;
use Google\Service\Drive\DriveFile;

class GoogleDriveService
{
    private $client;
    private $drive;
    private $driveId;

    public function __construct()
    {
        $this->client = new Client();
        $this->client->setAuthConfig([
            'type' => 'service_account',
            'private_key' => config('services.google.private_key'),
            'client_email' => config('services.google.client_email'),
            'client_id' => config('services.google.client_id'),
        ]);
        $this->client->setScopes([Drive::DRIVE]);

        $this->drive = new Drive($this->client);
        $this->driveId = config('services.google.drive_id');
    }

    public function uploadImageAsDocument($content): DriveFile
    {
        $file = new DriveFile();
        $file->setName('image');
        $file->setMimeType('application/vnd.google-apps.document');
        $file->setParents([$this->driveId]);

        $result = $this->drive->files->create(
            $file,
            [
                'data' => $content,
                'mimeType' => 'image/jpeg',
                'uploadType' => 'media',
                'fields' => 'id',
                'ocrLanguage' => 'ja',
            ]
        );

        return $result;
    }

    public function extractTextFromDocument($fileId)
    {
        $result = $this->drive->files->export($fileId, 'text/plain', ['alt' => 'media']);

        $content = $result->getBody()->getContents();

        return $content;
    }

    public function extractProductAndPrice($content)
    {
        $prices = [];
        $products = [];

        $lines = explode("\n", $content);
        foreach ($lines as $line) {
            $tokens = explode(' ', $line);

            $product = '';
            foreach ($tokens as $token) {
                if (preg_match('/[*¥]+/', $token)) {
                    $unComma = str_replace(',', '', $token);
                    preg_match('/\d+/', $unComma, $price);
                    $prices[] = (int)$price[0];

                } else {
                    $product .= $token;
                    $product .= ' ';
                }
            }

            $products[] = substr($product, 0, -1);
        }

        $results = [
            'products' => $products,
            'prices' => $prices,
        ];

        return $results;
    }
}
