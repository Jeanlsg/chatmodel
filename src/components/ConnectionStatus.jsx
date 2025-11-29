import { useEffect, useState } from 'react'
import { supabase } from '../supabaseClient'

export default function ConnectionStatus() {
    const [status, setStatus] = useState('Checking...')

    useEffect(() => {
        async function checkConnection() {
            try {
                const { error } = await supabase.from('test').select('*').limit(1)
                // If the table doesn't exist, we might get a 404 or a specific error code,
                // but it proves we reached Supabase. 
                // A better check might be auth.getSession() if we don't have a 'test' table.
                // Let's try getSession as it's less likely to fail due to missing tables.
                const { data, error: authError } = await supabase.auth.getSession()

                if (authError) throw authError

                setStatus('Connected')
            } catch (err) {
                console.error('Supabase connection error:', err)
                setStatus(`Error: ${err.message}`)
            }
        }

        checkConnection()
    }, [])

    return (
        <div style={{ position: 'fixed', bottom: '10px', right: '10px', padding: '10px', background: '#333', color: '#fff', borderRadius: '5px', zIndex: 9999 }}>
            Supabase Status: {status}
        </div>
    )
}
