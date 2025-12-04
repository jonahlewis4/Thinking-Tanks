import time
import sys

print("Python backend started!", flush=True)

for i in range(5):
    print(f"[Python] Count = {i}", flush=True)
    time.sleep(1)

print("Python backend finished.", flush=True)
