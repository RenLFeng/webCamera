/* 接口api统一管理 */
// 接口
const ajaxUrl = {
    baseURL: 'http://127.0.0.1:8088',//给特殊的接口$axios用
    //功能点
    login: '/face_pic_svr/login', // 登录接口
    logout: '/face_pic_svr/logout',//注销接口DELETE方法，而非get、post
    //获取系统状态
    getSysStatus:'/face_pic_svr/get_sys_status',
    //获取设备统计信息
    getDeviceStat:'/face_pic_svr/get_device_stat',
    //识别结果修正
    correctRecogn:'/face_pic_svr/correct_recogn',
    //获取设备日志
    getDeviceLog:'/face_pic_svr/get_device_log',
    //获取异常日志
    getWarnLog:'/face_pic_svr/get_warn_log',
    //添加设备
    addDevice:'/face_pic_svr/add_device',
    //编辑设备
    editDevice:'/face_pic_svr/edit_device',
    //删除设备
    deleteDevice:'/face_pic_svr/delete_device',
    //查询设备
    getDeviceList:'/face_pic_svr/get_device_list',
    //查询设备名称列表★
    getDeviceNameList:'/face_pic_svr/get_devicename_list',
    //添加商家
    addAgent:'/face_pic_svr/add_agent',
    //编辑商家
    editAgent:'/face_pic_svr/edit_agent',
    //删除商家
    deleteAgent:'/face_pic_svr/delete_agent',
    //查询商家
    getAgentList:'/face_pic_svr/get_agent_list',
    //添加用户
    addUser:'/face_pic_svr/add_user',
    //编辑用户
    editUser:'/face_pic_svr/edit_user',
    //删除用户
    deleteUser:'/face_pic_svr/delete_user',
    //查询用户
    getUserList:'/face_pic_svr/get_user_list',
    //添加设备类型
    addDevicetype:'/face_pic_svr/add_devicetype',
    //编辑设备类型
    editDevicetype:'/face_pic_svr/edit_devicetype',
    //删除设备类型
    deleteDevicetype:'/face_pic_svr/delete_devicetype',
    //查询设备类型
    getDevicetypeList:'/face_pic_svr/get_devicetype_list',
    //添加AI接口
    addAiport:'/face_pic_svr/add_aiport',
    //编辑AI接口
    editAiport:'/face_pic_svr/edit_aiport',
    //删除AI接口
    deleteAiport:'/face_pic_svr/delete_aiport',
    //查询AI接口
    getAiportList:'/face_pic_svr/get_aiport_list',
    //添加操作员
    addOperator:'/face_pic_svr/add_operator',
    //编辑操作员
    editOperator:'/face_pic_svr/edit_operator',
    //删除操作员
    deleteOperator:'/face_pic_svr/delete_operator',
    //查询操作员
    getOperatorList:'/face_pic_svr/get_operator_list',
    //修改密码
    changPassword:'/face_pic_svr/chang_password',
    //异常处理
    warnProcess:'/face_pic_svr/warn_process',
    //获取24小时抓图数据☆
    imgstatPerhour:'/face_pic_svr/imgstat_perhour',
    //用户分类统计☆
    usergroupStat:'/face_pic_svr/usergroup_stat',
    //获取年龄分段统计☆
    ageStat:'/face_pic_svr/age_stat',
    //获取最新8条人脸识别结果☆
    newImglist:'/face_pic_svr/new_imglist',
    //查询工厂列表☆
    getFactoryList:'/face_pic_svr/get_factory_list',
    //获取性别统计
    sexStat:'/face_pic_svr/sex_stat',
}
// 返回模块
export default ajaxUrl;