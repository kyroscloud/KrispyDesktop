# KrispyDesktop
### formerly KubeDesktop

This is an alpha project for managing Desktop computers for workshops at a conference. It is meant to provide timed workshop developer environments on phyical desktop computers for workshop attendees. It is also made to provide a better user experience for workshop attendees and make it easier for Workshop presenters to build and test the desired environment and content for their attendees.

This repo will be broken up into various repos soon.

### Folders:

* KrispyDeskKube: Deployment of services to support APIs and management of KrispyDesktop

* kd-workshop-api: The actual API service code for KrispyDesktop management.

* desktop-build: The template repo that is used and shared to build your own desktop environment utilizing Ubuntu Desktop.

### Things Not in this repo right now

* The code for the scheduler is not yet deployed here. The scheduler interacts with the API to change the workshops at a given time.

* The DesktopNode service that recognizes when Desktop nodes are added to the cluster and adds them to the database and appropriate workgroup id.