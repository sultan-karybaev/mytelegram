import Vue from 'vue'
import VueRouter from 'vue-router'
import HelloWorld from '@/components/HelloWorld'
import Chat from '@/components/Chat'
import User from '@/components/ChatSidebarContact'

Vue.use(VueRouter);

export default new VueRouter({
  routes: [
    {
      path: '/',
      name: 'HelloWorld',
      component: HelloWorld
    },
    {
      path: '/chat',
      name: 'Chat',
      component: Chat,
      children: [
        { path: ':chatID',
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
