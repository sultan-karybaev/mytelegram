import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Chat from '@/components/Chat'
import User from '@/components/ChatSidebarContact'
import Map from '@/components/Map'
import AudioFile from '@/components/AudioFile'
import Login from '@/components/Login'
import Test from '@/components/Test'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'Login',
      component: Login
    },
    {
      path: '/maps',
      name: 'Map',
      component: Map
    },
    {
      path: '/test',
      name: 'Test',
      component: Test
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      children: [
        { path: ':roomID',
          name: "contact",
          component: User}
      ]
    },
    {
      path: '*',
      redirect: "/chat"
    }
  ]
})
