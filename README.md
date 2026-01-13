# Intercom Custom App - API Data Fetcher

A custom Intercom inbox sidebar app that allows support agents to fetch and display data from external APIs directly within the Intercom interface.

## Features

- **API Integration**: Fetch data from any REST API endpoint
- **Multiple HTTP Methods**: Support for GET, POST, PUT, and PATCH requests
- **API Key Authentication**: Secure API key support for authenticated endpoints
- **Conversation Context**: Automatically includes conversation and contact data in API requests
- **JSON Display**: Beautifully formatted JSON response display with syntax highlighting
- **Configuration Persistence**: Saves API endpoint and credentials for quick access
- **Error Handling**: Clear error messages for failed API calls

## Setup Instructions

### 1. Create an Intercom Developer Account

1. Go to [Intercom Developer Hub](https://developers.intercom.com/)
2. Create a free development workspace
3. Navigate to the Developer Hub

### 2. Create Your Custom App

1. In the Developer Hub, click "Create App"
2. Fill in the app details:
   - **Name**: API Data Fetcher (or your preferred name)
   - **Description**: Fetch data from external APIs
   - **Location**: Details Panel (Sidebar)

### 3. Configure the App

1. Upload or host your app files:
   - `index.html` - Main app interface
   - `app.js` - App logic and API integration
   - `styles.css` - App styling
   - `app.json` - App manifest (optional, may be configured in Developer Hub)

2. Set the app URL to point to your hosted `index.html` file

### 4. Install the App

1. Go to "Test & Publish" in the Developer Hub
2. Select "Your Workspaces"
3. Click "Install app" next to your workspace
4. Note the Access Token provided (for API interactions if needed)

### 5. Add to Inbox Sidebar

1. Open Intercom Inbox
2. Click "Edit apps" on the Details panel
3. Select your custom app
4. Arrange its position in the sidebar

## Usage

1. **Enter API Endpoint**: Type the full URL of your API endpoint
2. **Select HTTP Method**: Choose GET, POST, PUT, or PATCH
3. **Add API Key** (optional): Enter your API key if the endpoint requires authentication
4. **Fetch Data**: Click "Fetch Data" to make the API call
5. **View Results**: The response will be displayed in a formatted JSON view

### API Request Details

- **GET Requests**: Conversation and contact IDs are appended as query parameters
- **POST/PUT/PATCH Requests**: Conversation and contact data are included in the request body
- **Authentication**: API keys are sent in the `Authorization` header as `Bearer {token}`

## Customization

### Changing API Key Header Format

If your API uses a different authentication header format, edit `app.js`:

```javascript
// Current format (line ~60):
requestOptions.headers['Authorization'] = `Bearer ${apiKey}`;

// Alternative formats:
requestOptions.headers['X-API-Key'] = apiKey;
requestOptions.headers['API-Key'] = apiKey;
```

### Modifying Request Body

To customize what data is sent in POST/PUT/PATCH requests, edit the `requestOptions.body` section in `app.js` (around line 70).

### Styling

Modify `styles.css` to match your brand colors and styling preferences.

## Development

### Local Testing

1. Host the files on a local server (e.g., using `python -m http.server` or `npx serve`)
2. Use ngrok or similar tool to create a public URL
3. Point your Intercom app to the public URL

### File Structure

```
custom_app/
├── index.html      # Main app interface
├── app.js          # App logic and API calls
├── styles.css      # Styling
├── app.json        # App manifest (optional)
└── README.md       # This file
```

## Security Considerations

- API keys are stored in browser localStorage (not encrypted)
- Consider implementing server-side proxy for sensitive API calls
- Use HTTPS for all API endpoints
- Validate and sanitize all user inputs

## Troubleshooting

### App Not Appearing in Sidebar
- Ensure the app is installed in your workspace
- Check that the app URL is accessible and returns valid HTML
- Verify Canvas Kit script is loading correctly

### API Calls Failing
- Check browser console for CORS errors
- Verify API endpoint URL is correct
- Ensure API key format matches your API requirements
- Check network tab for request/response details

### Data Not Displaying
- Verify API response is valid JSON
- Check browser console for JavaScript errors
- Ensure Canvas Kit is properly initialized

## Support

For Intercom-specific issues, refer to:
- [Intercom Developer Documentation](https://developers.intercom.com/)
- [Canvas Kit Documentation](https://developers.intercom.com/docs/canvas-kit)

## License

This is a custom app template. Modify as needed for your use case.
