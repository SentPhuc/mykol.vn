import subprocess

author = "huylv6"
result = subprocess.check_output(['git', 'log', '--shortstat', f'--author={author}']).decode('utf-8')

added_lines = 0
deleted_lines = 0

lines = result.strip().split('\n')
for line in lines:
    if 'files changed' in line:
        changes = line.split(',')
        added = int(changes[1].strip().split(' ')[0])
        if len(changes) >= 3:
            deleted = int(changes[2].strip().split(' ')[0])
        else:
            deleted = 0
        added_lines += added
        deleted_lines += deleted

total_lines = added_lines + deleted_lines
print(f"Added lines: {added_lines}")
print(f"Deleted lines: {deleted_lines}")
print(f"Total lines: {total_lines}")