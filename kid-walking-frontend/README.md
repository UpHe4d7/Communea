# kid-walking-frontend

## Project setup
```
npm install
```

### Compiles and hot-reloads for development
```
npm run serve
```

### Compiles and minifies for production
```
npm run build
```

### Lints and fixes files
```
npm run lint
```

### Customize configuration
See [Configuration Reference](https://cli.vuejs.org/config/).


## The page corresponding to each vue file

### HomePage:
HomePage.vue: Homepage before log in.

-    ContactModal.vue: A small static card showing our team's contact details.

Login.vue: Login page.

Register.vue: Register page.

-    VerificationModal.vue: sms Verification Modal showing in Register page.
    
MissionStatement.vue: Show static page for Mission Statement

ParentFAQ.vue: FAQ for parents, can be access from HomePage.

WalkerFAQ.vue: FAQ for walkers, can be access from HomePage.

Teamintro.vue: A static page showing our team info.


### Parent's page:
SidebarMenu.vue: Siderbar for all parent page.

HomeView.vue: Homepage of parents, showing nearby walkers.

-    WalkerDetail.vue: Walker info for parent to view.
  
-    -    ShareRequestDialog.vue: List displayed when parents share a request to walker.

mypost.vue: Parents browsing the request list page.

-    NewRequest.vue: Page showing when parent want to add a new request.

-    PostDetails.vue: The request's detail page, which is used to be viewed and edited by the parent.

ParentApplication.vue: Showing application list for parents.

-    PendingDetail.vue: Details page of applications received by parents.

-    -    PreMeetModal.vue: The page displayed by opening the premeet button when parents view the application contains walker contact details.

Agreement.vue: Parents browsing the agreement list page.

-    MapPage.vue: A component included in the parent viewing agreement details page, showing the map and live tracing fuction.

Parent profile: 

-    ParentProfile.vue: Basic info page in parent profile.

-    MyAddress.vue: Address info page in parent profile.

-    MyChildren.vue: Childre info page in parent profile.

-    UserSettings.vue: Setting page in parent profile.


### Walker's page:
WalkerAdditionalinfo.vue: Walker additional info edit page after Register page, only for walker.

WalkerSidebarMenu.vue: Siderbar for all walker pages.

WalkerHome.vue: Homepage for walker, showing nearby request.

WalkerParentRequest.vue: Walker can browse list of requests shared by parent.

-    RequestDetail.vue: The request's detail page, which is used to be viewed by the walker.

WalkerMyApplication.vue: Walkers browsing their application list page.

WalkerMyAgreement.vue: Walkers browsing the agreement list page.

-    WalkerAgreementDetails.vue: Page showing when walker viewing the agreement detail.

-    -    WalkerMap.vue: A component included in the walker viewing agreement details page, showing the map and live tracing fuction.

Walker profile:

-    WalkerProfile.vue: Basic info page in walker profile.

-    WalkerAddress.vue: Address info page in walker profile.

-    WalkerSkills.vue: Description and schedule page in walker profile.

-    WalkerSettings.vue: Setting page in walker profile.

WalkerMyRatings.vue: Walkers can browse their rating and recent comments.


### Administrator page

ManagerHome.vue: Homepage for administrator.

StatisticsPage.vue: Traffic graph display page, for administrator.

### Others

GlobalNav.vue: Global Navigation.

ParentDetail.vue: Showing parent details, not used for now. 

Sidebarlcon.vue
