# GitHub Workflow Standards for Branching and PRs

This document outlines the standard practices for using GitHub in a collaborative development environment. It applies to all developers working on feature branches, shared branches, or long-lived branches like `master` or `server-acl`.

---

## 🔁 Commit and Merge Policy

### ✅ All Code Changes Must Go Through Pull Requests (PRs)

* **Never push directly** to `master`, `server-acl`, or any shared branch.
* **Every change** must be reviewed and merged through a PR.

### ✅ Resolving PRs (in GitHub UI)

* Use **"Rebase and merge"** for a clean, linear history (ideal for small feature branches).
* Use **"Squash and merge"** if you want to combine multiple commits into one.
* Avoid **"Merge commit"** unless necessary (e.g., for preserving history of larger branches).

---

## 🔄 Keeping Feature Branches Up-To-Date

When working on a long-lived or shared feature branch (e.g., `server-acl`):

### ✅ Periodically Pull from `master`

```bash
git checkout server-acl
git fetch origin
git merge origin/master  # ✅ Use merge, not rebase
```

* **Do this regularly** when `master` receives updates (e.g., daily or weekly).
* Helps avoid large conflicts during the final merge.

### ❌ Avoid Rebasing Shared Branches

* Never use `git pull --rebase origin master` on branches like `server-acl`.
* Rebasing rewrites history and can cause orphaned commits and lost context.

---

## 🔀 Personal Feature Branches

When working on a **personal** feature branch (e.g., `feat/JIRA-123-feature`):

### ✅ You May Rebase to Keep Clean History

```bash
git checkout feat/JIRA-123-feature
git fetch origin
git rebase origin/server-acl
```

* Safe if you're the **only one** working on the branch.
* Helps keep PRs minimal and reviewable.

### ✅ Before Raising a PR

```bash
git fetch origin
# If needed:
git rebase origin/server-acl
# Then:
git push --force-with-lease
```

---

## 🧹 Summary Table

| Task                                          | Use `merge` | Use `rebase` |
| --------------------------------------------- | ----------- | ------------ |
| Pull changes from `master` into shared branch | ✅ Yes       | ❌ No         |
| Prepare your personal branch for PR           | Optional    | ✅ Yes        |
| PR from feature to parent (GitHub UI)         | N/A         | ✅ Yes (UI)   |

---

## 📦 Tags and Releases

* All releases should be created via the GitHub UI or automation.
* Tag conventions: `v1.0.0`, `v1.0.1-beta-server-acl`, etc.
* Avoid direct creation or deletion of tags without coordination.

---

For questions, please contact the repository maintainers.

---

*This document represents industry-standard practices followed in open-source and product-based companies using GitHub workflows.*

Looks good.
