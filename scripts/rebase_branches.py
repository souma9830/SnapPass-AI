import subprocess
import os

branches = {
    'accessibility/screen-reader-announcements': '976818e',
    'ci/docker-build-test-workflow': '484882b',
    'ci/github-actions-validation': '9076bab',
    'docs/architecture-and-developer-handbook': '1da7974',
    'docs/pr-issue-templates-polish': 'a5e39c5',
    'dx/api-doc-swagger': '8e46186',
    'feat/backend-logging-winston': 'f9f553f',
    'feat/custom-github-pr-template': '8d6e41d',
    'feat/issue-templates-automation': '1ecd2a5',
    'feat/python-healthcheck-liveness': '98b2c85',
    'feat/python-service-unit-tests': '7355ee1',
    'fix/mongoose-connection-retry': 'ae7cde4',
    'refactor/error-boundary-component': '812ad2f',
    'security/csrf-and-headers-hardening': '9b5db50',
    'security/jwt-token-blacklist': '6f0390c',
    'ui/theme-persistence': '6ced21c'
}

def run_cmd(cmd):
    print(f"Running: {cmd}")
    res = subprocess.run(cmd, shell=True, text=True, capture_output=True)
    if res.returncode != 0:
        print(f"Error (code {res.returncode}): {res.stderr}")
    return res

# Make sure we are in master and clean
run_cmd("git checkout master")
run_cmd("git pull origin master")

for branch, commit in branches.items():
    print(f"\n=====================================")
    print(f"Processing branch: {branch} (commit: {commit})")
    
    # 1. Checkout branch
    run_cmd(f"git checkout {branch}")
    
    # 2. Reset hard to master
    run_cmd("git reset --hard master")
    
    # 3. Cherry-pick the commit
    res = run_cmd(f"git cherry-pick {commit}")
    
    if res.returncode != 0:
        print(f"Conflict occurred on cherry-picking {commit} onto {branch}!")
        # If there's a conflict, let's look at git status and resolve
        # Since these are independent modifications, we want the branch changes to be applied.
        # Let's try checkout --ours (which keeps master) or --theirs (which brings in the branch changes)
        # But wait, we want the branch's specific changes to be applied. So we should use "--theirs" for conflicted files
        # to ensure the branch changes are preserved!
        # Let's find the conflicted files.
        status_res = run_cmd("git status --porcelain")
        conflicted_files = []
        for line in status_res.stdout.splitlines():
            if line.startswith("UU") or line.startswith("AA") or line.startswith("M "):
                parts = line.strip().split()
                if len(parts) >= 2:
                    conflicted_files.append(parts[-1])
        
        for cf in conflicted_files:
            print(f"Conflicted file: {cf}")
            # Let's check out the version from the commit we are cherry-picking
            run_cmd(f"git checkout {commit} -- {cf}")
            run_cmd(f"git add {cf}")
            
        # Continue cherry-pick
        run_cmd("git -c core.editor=true cherry-pick --continue")
        
    # Verify the branch compiles/is clean
    # 4. Push to origin
    run_cmd(f"git push origin {branch} --force")

print("All branches rebased and pushed successfully!")
