import os

for file in os.listdir("/"):
    if file.endswith(".png"):
        print(os.path.join("/", file))
