export const sendMessageToN8n = async (message, userId) => {
    // TODO: Replace with your actual n8n webhook URL
    const WEBHOOK_URL = 'https://n8n.jeanlsg.site/webhook/PIBITI';

    if (!userId) {
        console.error('userId is missing');
        throw new Error('userId is required');
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                userId,
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

export const sendMessageToTriagem = async (message, userId) => {
    const WEBHOOK_URL = 'https://n8n.jeanlsg.site/webhook/triagem';

    if (!userId) {
        console.error('userId is missing');
        throw new Error('userId is required');
    }

    try {
        const response = await fetch(WEBHOOK_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                message,
                userId,
                timestamp: new Date().toISOString()
            }),
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error sending message to triage:', error);
        throw error;
    }
};
