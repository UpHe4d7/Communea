import { createRouter, createWebHistory } from 'vue-router';
import HomeView from '../components/HomeView.vue';
import SidebarMenu from '../components/SidebarMenu.vue';
import WalkerDetail from '../components/WalkerDetail.vue';
import ParentProfile from '../components/ParentProfile.vue';
import MyChildren from '../components/MyChildren.vue';
import MyAddress from '../components/MyAddress.vue';
import UserSettings from '../components/UserSettings.vue'
import Login from '../components/Login.vue';
import Register from '../components/Register.vue';
import WalkerAdditionalInfo from '../components/WalkerAdditionalInfo.vue';
import WalkerHomeView from '../components/WalkerHome.vue';
import WalkerSidebarMenu from '../components/WalkerSidebarMenu.vue';
import WalkerProfile from '../components/WalkerProfile.vue';
import WalkerSkills from '../components/WalkerSkills.vue';
import WalkerAddress from '../components/WalkerAddress.vue';
import WalkerSettings from '../components/WalkerSettings.vue';
import ParentApplication from '../components/ParentApplication.vue';
import PendingDetail from '../components/PendingDetail.vue';
import PreMeetModal from '../components/PreMeetModal.vue';
import Agreement from '../components/Agreement.vue';
import MyPost from '../components/mypost.vue';
import PostDetails from '../components/PostDetails.vue'
import NewRequest from '../components/NewRequest.vue'
import WalkerParentRequest from '../components/WalkerParentRequest.vue'
import RequestDetail from '../components/RequestDetail.vue'
import WalkerMyApplication from '../components/WalkerMyApplication.vue'
import WalkerMyAgreement from '../components/WalkerMyAgreement.vue'
import WalkerAgreementDetails from '../components/WalkerAgreementDetails.vue'
import WalkerMyRatings from '../components/WalkerMyRatings.vue'
import HomePage from '../components/HomePage.vue'
import ParentFAQ from '../components/ParentFAQ.vue'
import WalkerFAQ from '../components/WalkerFAQ.vue'
import StatisticsPage from "@/components/StatisticsPage.vue";
import ManagerHome from "@/components/ManagerHome.vue";
import MissionStatement from "@/components/MissionStatement.vue";
import TeamIntro from "@/components/TeamIntro.vue";

const routes = [
  {
    path: '/',
    name: 'HomePage',
    component: HomePage
  },
  {
    path: '/home',
    name: 'HomeView',
    component: HomeView
  },
  {
    path: '/parent-faq',
    name: 'ParentFAQ',
    component: ParentFAQ
  },
  {
    path: '/walker-faq',
    name: 'WalkerFAQ',
    component: WalkerFAQ
  },
  // ... 其余路由保持不变
  { path: '/request/:id', name: 'RequestDetail', component: RequestDetail },
  { path: '/walker-my-applications', name: 'WalkerMyApplication', component: WalkerMyApplication },
  { path: '/walker-my-agreements', name: 'WalkerMyAgreement', component: WalkerMyAgreement },
  { path: '/walker-agreement-details/:id', name: 'WalkerAgreementDetails', component: WalkerAgreementDetails },
  { path: '/walker-my-ratings', name: 'WalkerMyRatings', component: WalkerMyRatings },
  {
    path: '/walkerparentrequest',
    name: 'WalkerParentRequest',
    component: WalkerParentRequest
  },
  {
    path: '/mypost',
    name: 'MyPost',
    component: MyPost
  },
  {
    path: '/post/:id',
    name: 'PostDetails',
    component: PostDetails
  },
  {
    path: '/new-request',
    name: 'NewRequest',
    component: NewRequest
  },
  {
    path: '/sidebar',
    name: 'SidebarMenu',
    component: SidebarMenu
  },
  {
    path: '/agreement',
    name: 'Agreement',
    component: Agreement
  },
  {
    path: '/pre-meet-modal',
    name: 'PreMeetModal',
    component: PreMeetModal,
    props: true,
  },
  {
    path: '/walker/:id',
    name: 'WalkerDetail',
    component: WalkerDetail,
    props: true
  },
  {
    path: '/walker-profile',
    name: 'WalkerProfile',
    component: WalkerProfile,
  },
  {
    path: '/walker-sidebar',
    name: 'WalkerSidebarMenu',
    component: WalkerSidebarMenu,
  },
  {
    path: '/parent-detail/:id',
    name: 'ParentDetail',
    component: () => import('@/components/ParentDetail.vue'),
    props: true
  },
  {
    path: '/parent-application',
    name: 'ParentApplication',
    component: ParentApplication,
  },
  {
    path: '/pending-detail/:id',
    name: 'PendingDetail',
    component: PendingDetail,
  },
  {
    path: '/profile',
    name: 'ParentProfile',
    component: ParentProfile
  },
  {
    path: '/children',
    name: 'MyChildren',
    component: MyChildren
  },
  { path: '/walker-skills', component: WalkerSkills },
  { path: '/walker-address', component: WalkerAddress },
  { path: '/walker-settings', component: WalkerSettings },
  {
    path: '/settings',
    name: 'UserSettings',
    component: UserSettings
  },
  { path: '/login', component: Login },
  { path: '/register', component: Register },
  { path: '/register/walker', component: WalkerAdditionalInfo },
  {
    path: '/walker-home',
    name: 'WalkerHome',
    component: WalkerHomeView
  },
  {
    path: '/address',
    name: 'MyAddress',
    component: MyAddress
  },
  {
    path:'/statisticsPage',
    name:'StatisticsPage',
    component: StatisticsPage
  },
  {
    path: '/ManagerHome',
    name: 'ManagerHome',
    component: ManagerHome
  },
  {
    path: '/MissionStatement',
    name: 'MissionStatement',
    component: MissionStatement
  },
  {
    path: '/TeamIntroduction',
    name: 'TeamIntroduction',
    component: TeamIntro
  }

];

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
});

export default router;