import Main from '@/views/Main.vue';

// 不作为Main组件的子页面展示的页面单独写，如下
export const loginRouter = {
    path: '/login',
    name: 'login',
    meta: {
        title: 'Login - 登录'
    },
    component: () => import('@/views/login.vue')
};
export const registerRouter = {
    path: '/register',
    name: 'register',
    meta: {
        title: 'Register - 注册'
    },
    component: () => import('@/views/register.vue')
};
export const forgetPwdRouter = {
    path: '/forgetPwd',
    name: 'forgetPwd',
    meta: {
        title: 'forgetPwd - 忘记密码'
    },
    component: () => import('@/views/forgetPwd.vue')
};

export const page404 = {
    path: '/*',
    name: 'error-404',
    meta: {
        title: '404-页面不存在'
    },
    component: () => import('@/views/error-page/404.vue')
};

export const page403 = {
    path: '/403',
    meta: {
        title: '403-权限不足'
    },
    name: 'error-403',
    component: () => import('@//views/error-page/403.vue')
};

export const page500 = {
    path: '/500',
    meta: {
        title: '500-服务端错误'
    },
    name: 'error-500',
    component: () => import('@/views/error-page/500.vue')
};

export const locking = {
    path: '/locking',
    name: 'locking',
    component: () => import('@/views/main-components/lockscreen/components/locking-page.vue')
};

// 作为Main组件的子页面展示但是不在左侧菜单显示的路由写在otherRouter里
export const otherRouter = {
    path: '/',
    name: 'otherRouter',
    redirect: '/maintain',
    component: Main,
    children: [
        {
            path:'/maintain',
            name:'maintain',
            title: '日常维护',
            redirect: '/maintain/masterControl',
            component: () => import('@/views/maintain/maintain.vue'),
            children:[
                { path: '/maintain/todayControl', title: '今日面板', name: 'todayControl', component: () => import('@/views/maintain/todayControl.vue')},
                { path: '/maintain/masterControl', title: '主控面板', name: 'masterControl', component: () => import('@/views/maintain/masterControl.vue')},
                { path: '/maintain/deviceLog', title: '设备日志', name: 'deviceLog', component: () => import('@/views/maintain/deviceLog.vue')},
                { path: '/maintain/deviceAbnormal', title: '设备异常', name: 'deviceAbnormal', component: () => import('@/views/maintain/deviceAbnormal.vue')},
            ]
        },
        {
            path:'/manage',
            name:'manage',
            title: '运维管理',
            redirect: '/manage/deviceManage',
            component: () => import('@/views/manage/manage.vue'),
            children:[
                { path: '/manage/deviceManage', title: '设备管理', name: 'deviceManage', component: () => import('@/views/manage/deviceManage.vue')},
                { path: '/manage/customerManage', title: '客户管理', name: 'customerManage', component: () => import('@/views/manage/customerManage.vue')},
                { path: '/manage/browse', title: '用户浏览', name: 'browse', component: () => import('@/views/manage/browse.vue')},
            ]
        },
        {
            path:'/system',
            name:'system',
            title: '运维管理',
            redirect: '/system/deviceType',
            component: () => import('@/views/system/system.vue'),
            children:[
                { path: '/system/deviceType', title: '设备类型', name: 'deviceType', component: () => import('@/views/system/deviceType.vue')},
                { path: '/system/interface', title: '接口管理', name: 'interface', component: () => import('@/views/system/interface.vue')},
                { path: '/system/operator', title: '操作员管理', name: 'operator', component: () => import('@/views/system/operator.vue')},
                { path: '/system/changePassword', title: '密码修改', name: 'changePassword', component: () => import('@/views/system/changePassword.vue')},
            ]
        },
        // 消息中心
        {
            path:'/message',
            name:'messageRouter',
            title: '消息中心',
            redirect: '/message/backstage-notice',
            component: () => import('@/views/message/message.vue'),
            children:[
                { path: '/message/backstage-notice', title: '后台公告', name: 'backstageNotice', component: () => import('@/views/message/backstage-notice.vue')},
                { path: '/message/notice-detail', title: '公告详情', name: 'noticeDetail', component: () => import('@/views/message/notice-detail.vue')},
                { path: '/message/notice-message', title: '通知消息', name: 'noticeMessage', component: () => import('@/views/message/notice-message.vue')},
                { path: '/message/user-feedback', title: '用户反馈', name: 'userFeedback', component: () => import('@/views/message/user-feedback.vue')},
                { path: '/message/message-detail', title: '消息详情', name: 'messageDetail', component: () => import('@/views/message/message-detail.vue')}
            ]
        },
        // 消息详情
        {
            path:'/detail',
            name:'detailRouter',
            title: '消息详情',
            /* redirect: '/message/message-detail', */
            component: () => import('@/views/message/detail.vue'),
            /* children:[
                { path: '/message/message-detail', title: '消息详情', name: 'messageDetail', component: () => import('@/views/message/message-detail.vue')},
            ] */
        },
        // 消息中心
        {
            path:'/personal',
            name:'personalRouter',
            title: '个人中心',
            redirect: '/personal/personal-info',
            component: () => import('@/views/personal/personal.vue'),
            children:[
                { path: '/personal/personal-info', title: '基本信息', name: 'personalInfo', component: () => import('@/views/personal/personal-info.vue')},
                { path: '/personal/release-records', title: '发布记录', name: 'releaseRecords', component: () => import('@/views/personal/release-records.vue')},
                { path: '/personal/api-author', title: '云API授权', name: 'apiAuthor', component: () => import('@/views/personal/api-author.vue')}
            ]
        },
    ]
};

// 作为Main组件的子页面展示并且在左侧菜单显示的路由写在appRouter里
export const appRouter = [
    {
        path: '/access',
        icon: 'key',
        name: 'access',
        title: '权限管理',
        component: Main,
        children: [
            { path: 'index', title: '权限管理', name: 'access_index', component: () => import('@/views/access/access.vue') }
        ]
    },
    {
        path: '/access-test',
        icon: 'lock-combination',
        title: '权限测试页',
        name: 'accesstest',
        access: 0,
        component: Main,
        children: [
            { path: 'index', title: '权限测试页', name: 'accesstest_index', access: 0, component: () => import('@/views/access/access-test.vue') }
        ]
    },
    {
        path: '/international',
        icon: 'earth',
        title: {i18n: 'international'},
        name: 'international',
        component: Main,
        children: [
            { path: 'index', title: {i18n: 'international'}, name: 'international_index', component: () => import('@/views/international/international.vue') }
        ]
    },
    {
        path: '/advanced-router',
        icon: 'ios-infinite',
        name: 'advanced-router',
        title: '高级路由',
        component: Main,
        children: [
            { path: 'mutative-router', title: '动态路由', name: 'mutative-router', icon: 'link', component: () => import('@/views/advanced-router/mutative-router.vue') },
            { path: 'argument-page', title: '带参页面', name: 'argument-page', icon: 'android-send', component: () => import('@/views/advanced-router/argument-page.vue') }
        ]
    },
    {
        path: '/error-page',
        icon: 'android-sad',
        title: '错误页面',
        name: 'errorpage',
        component: Main,
        children: [
            { path: 'index', title: '错误页面', name: 'errorpage_index', component: () => import('@/views/error-page/error-page.vue') }
        ]
    }
];

// 所有上面定义的路由都要写在下面的routers里
export const routers = [
    loginRouter,
    registerRouter,
    forgetPwdRouter,
    otherRouter,
    locking,
    ...appRouter,
    page500,
    page403,
    page404
];
