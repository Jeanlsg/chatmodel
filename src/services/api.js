export const sendMessageToN8n = async (message) => {
    // TODO: Replace with your actual n8n webhook URL
    const WEBHOOK_URL = 'https://n8n.jeanlsg.site/webhook/PIBITI';

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        // If n8n returns a JSON response, you can parse it here
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message:', error);
        throw error;
    }
};
