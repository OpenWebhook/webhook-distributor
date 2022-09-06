import http from 'k6/http';
import { sleep } from 'k6';
import exec from 'k6/execution';

export const options = {
  stages: [
    { duration: '10s', target: 20 },
    { duration: '15s', target: 10 },
    { duration: '20s', target: 0 },
  ],
};

export default function () {
  http.post(
    'http://localhost:3000',
    JSON.stringify({ iterationInScenario: exec.vu.iterationInScenario }),
    {
      headers: {
        'Content-Type': 'application/json',
        'x-idempotent-key': 'idInTest-' + exec.vu.idInTest,
        'x-original-target-host': 'https://google.com',
      },
    },
  );
  sleep(0.9);
}
