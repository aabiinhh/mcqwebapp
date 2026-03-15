async function run() {
    try {
        console.log("Registering/Logging in...");
        let token;
        try {
            const res = await fetch('http://localhost:5000/api/auth/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    name: "API Tester",
                    email: "apitester@test.com",
                    password: "password123",
                    role: "student"
                })
            });
            const data = await res.json();
            if (!res.ok) throw new Error(data.message);
            token = data.token;
        } catch (e) {
            const res = await fetch('http://localhost:5000/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    email: "apitester@test.com",
                    password: "password123"
                })
            });
            const data = await res.json();
            token = data.token;
        }

        const headers = { 'Authorization': `Bearer ${token}` };

        console.log("Fetching tests...");
        const testsRes = await fetch('http://localhost:5000/api/tests', { headers });
        const testsData = await testsRes.json();
        const test = testsData.tests[0];
        console.log("Starting test:", test.title, test._id);

        console.log("Hitting POST /start...");
        const startRes = await fetch(`http://localhost:5000/api/tests/${test._id}/start`, { method: 'POST', headers });
        const startData = await startRes.json();
        console.log("Start response:", startRes.status, startData);

        const attemptId = startData.attempt_id;

        console.log("Hitting GET /questions...");
        const nextRes = await fetch(`http://localhost:5000/api/tests/attempt/${attemptId}/next`, { headers });
        const nextData = await nextRes.json();
        console.log("Next Question Response:", nextRes.status, nextData);

        console.log("Ending test early...");
        const finishRes = await fetch(`http://localhost:5000/api/tests/attempt/${attemptId}/finish`, { method: 'POST', headers });
        const finishData = await finishRes.json();
        console.log("Finish Response:", finishRes.status, finishData);

        console.log("Attempting RETAKE...");
        const retakeStartRes = await fetch(`http://localhost:5000/api/tests/${test._id}/start`, { method: 'POST', headers });
        const retakeStartData = await retakeStartRes.json();
        console.log("RETAKE Start Response:", retakeStartRes.status, retakeStartData);

        if (retakeStartData.attempt_id) {
            const retakeNextRes = await fetch(`http://localhost:5000/api/tests/attempt/${retakeStartData.attempt_id}/next`, { headers });
            const retakeNextData = await retakeNextRes.json();
            console.log("RETAKE Next Question Response:", retakeNextRes.status, retakeNextData);
        }

    } catch (err) {
        console.error("ERROR:", err.message);
    }
}
run();
