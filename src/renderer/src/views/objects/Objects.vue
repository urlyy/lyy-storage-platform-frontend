<template>
  <div class="objects">
    <div style="display: flex;justify-content: space-between;margin-bottom: 5px;">
      <div>
        <span>{{ bStore.userId == uStore.id ? '我' : '用户' + bStore.userId }}的Bucket</span>
        <span style="margin-left: 10px;">当前权限:{{ computedBucketAuthority(curBucketAuthority) }}</span>
        <span style="margin-left: 10px;">仓库状态:{{ curBucketStatus== 0 ? "私有" : "部分公开" }}</span>
        <button v-if="curBucketAuthority == 'admin'" class="btn" @click="showBucketAuthorityDialog"
          style="margin-left: 10px;margin-right: 5px;">设置桶权限</button>
      </div>
      <div>
        <button class="btn" style="background-color: grey;color:white" @click="logout">登出</button>
      </div>

    </div>
    <div style="display: flex;justify-content: space-between;margin-bottom: 5px;">
      <div>
        <input class="bucket-search-input" v-model="bucketQuery.name" placeholder="输入完整Bucket名" />
        <button class="btn" @click="searchBucket">搜索bucket</button>
        <button v-show="bStore.userId != uStore.id" style="margin-left:5px" class="btn"
          @click="back2MyBucket">返回我的bucket</button>
      </div>
      <div>
        <el-popover v-if="curBucketAuthority == 'admin' || curBucketAuthority == 'readWrite'" placement="right"
          :width="400" trigger="click">
          <template #reference>
            <button class="btn">上传</button>
          </template>
          <el-upload drag :action="config.configs[config.ENV].backend_path + '/object'"
            :headers="{ token: uStore.token }" :on-success="onUploadFileSuccess"
            :data="{ bucket_id: bStore.id, type: upload_type }">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件至此或<em>点击选择文件来上传</em>
            </div>
            <template #tip>
              <div>
                <span>上传类型：</span>
                <input type='radio' id="radio-file" value='file' v-model='upload_type' />
                <label for='radio-file'>文件</label>
                <input type='radio' id="radio-image" value='image' v-model='upload_type' />
                <label for='radio-image'>图片</label>
              </div>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-popover>
        <button class="btn" @click="doRefresh">刷新</button>
      </div>
    </div>
    <div style="display: flex;justify-content: space-between;">
      <div style="margin-bottom: 3px;">
        按
        <select v-model="objectSearchType" class="obejct-search-select">
          <option v-for="(o, index) in objectSearchOptions" :value="o.value" class="obejct-search-option">{{ o.name }}
          </option>
        </select>
        <input v-if="objectSearchType == 'txt'" v-model="objectsQuery.annSearchImgByTxt" type="text" placeholder="对象名"
          class="obejct-search-input" />
        <button v-if="objectSearchType == 'txt'" class="btn" @click="searchObjectsByTxt">文本近似匹配</button>
        <el-popover v-if="objectSearchType == 'image'" placement="right" :width="400" trigger="click">
          <template #reference>
            <button class="btn">上传图片</button>
          </template>
          <el-upload drag method="post"
            :action="config.configs[config.ENV].backend_path + '/img/search/' + bStore.id + '/img'"
            :headers="{ token: uStore.token }" :before-upload="onBeforeSearchImgByImg"
            :on-success="onSearchImageByImageSuccess">
            <el-icon class="el-icon--upload"><upload-filled /></el-icon>
            <div class="el-upload__text">
              拖拽文件至此或<em>点击选择文件来上传</em>
            </div>
            <template #tip>
              <div class="el-upload__tip">
                jpg/png files with a size less than 500kb
              </div>
            </template>
          </el-upload>
        </el-popover>
        <!-- <button class="btn">搜索对象</button> -->
      </div>
      <div>
        <button @click="multipleDownload" class="btn">下载选中</button>
      </div>
    </div>
    <el-table v-loading="tableLoading" class="table" height="500" :data="filterTableData"
      @selection-change="handleSelectionChange" border>
      <el-table-column type="selection" width="40" />
      <el-table-column>
        <template #header>
          <span>对象名</span>
          <input v-model="objectsQuery.keyword" placeholder="按对象名筛选" style="margin-left:5px;outline:none" />
        </template>
        <template #default="scope">
          {{ scope.row.name }}
        </template>
      </el-table-column>
      <el-table-column prop="size" label="大小 (字节)" width="95" align="center">
      </el-table-column>
      <el-table-column prop="content_type" label="类型" width="95" align="center">
      </el-table-column>
      <!-- <el-table-column label="权限" width="95" align="center">
        <template #default="scope">
          {{ computedObjectAuthority(scope.row.act) }}
        </template>
      </el-table-column> -->
      <el-table-column label="可检索" width="75" align="center">
        <template #default="scope">
          {{ scope.row.type == "image" }}
        </template>
      </el-table-column>
      <el-table-column label="创建人id" width="95" align="center">
        <template #default="scope">
          {{ scope.row.user_id }}
        </template>
      </el-table-column>
      <el-table-column prop="create_time" label="创建时间" width="164" align="center"></el-table-column>
      <el-table-column label="操作" width="370" align="center">
        <template #default="scope">
          <select @change="(e) => { modifyObjectStatus(e.target.value, scope.row) }" v-if="scope.row.act == 'admin'" o
            v-model="scope.row.status" style="font-size: 17px;height: 26px;vertical-align: middle;">
            <option value="1">公开</option>
            <option value="0">私有</option>
          </select>
          <button class="btn option-btn" @click="downloadObject(scope.$index, scope.row)">下载</button>
          <button class="btn option-btn" @click="showPreviewDialog(scope.$index, scope.row)">预览</button>
          <button v-if="scope.row.act == 'admin'" class="btn option-btn"
            @click="showPresignedUrlDialog(scope.$index, scope.row)">分享</button>
          <button class="btn option-btn" @click="removeObject(scope.$index, scope.row)">删除</button>
        </template>
      </el-table-column>
    </el-table>
    <el-dialog :show-close="false" v-model="presignedUrlDialogVisible" title="文件分享链接" width="30%" center>
      <div style="font-size: 20px;text-align: center;">
        这是一个临时分享链接<br>最多设置七天过期时间
      </div>
      <div style="font-size: 20px;">
        <!-- <div style="text-align: center;">
          设置过期时间
        </div> -->
        <div style="display: flex;justify-content: center;margin-top:10px;">
          <span v-for="(time, index) in presignedUrlExpire" class="presigned-url-expire-selector">
            <span class="title">{{ time.name }}</span>
            <span class="selector">
              <input v-if="time.name == '天'" v-model="time.value" max="7" min="0" />
              <input v-else v-model="time.value" max="60" min="0" />
            </span>
          </span>
        </div>
      </div>
      <template #footer>
        <div v-if="presignedUrl != ''">
          <input class="presigned-ur-copy-link" v-model="presignedUrl" />
          <button class="presigned-ur-copy-btn" @click="copy2ClipBoard">复制</button>
        </div>
        <span style="display: inline-flex;margin-top:10px" class="dialog-footer">
          <el-button @click="getPresignedUrl">获取链接</el-button>
          <el-button @click="closePresignedUrlDialog">关闭</el-button>
        </span>
      </template>
    </el-dialog>
    <el-dialog v-model="previewDialogVisible" style="max-height: 450px;overflow-y:scroll;" title="预览" width="30%"
      center>
      <span style="text-align: center;font-size: 20px;">
        对象名：<br>{{ selectedRow.row.name }}
      </span>
      <img class="preview-img" v-if="previewDialogVisible" :src="previewUrl" />
    </el-dialog>
    <!-- 设置bucket权限 -->
    <el-dialog v-model="bucketAuthorityDialogVisible" title="设置文件桶访问权限" width="38%" center>
      <div>
        <span style="font-size:16px">访问类型</span>
        <span v-for="(item, index) in bucketStatusOptions">
          <input @click="modifyBucketStatus(item.value)" type='radio' :value='item.value' v-model='curBucketStatus' />{{
            item.name
          }}
        </span>
      </div>
      <div v-show="curBucketStatus == 1">
        <div>
          <table width="400px" border="1" cellspacing="0" cellpadding="10">
            <caption style="font-size:16px">用户列表</caption>
            <tr>
              <th>用户id</th>
              <th>当前权限</th>
              <th>操作</th>
            </tr>
            <tr v-for="(item, idx) in bucketRules" align="center">
              <td>{{ item.userId }}</td>
              <td> {{ computedBucketAuthority(item.act) }}</td>
              <td>
                <span v-for="(option, index) in bucketAuthorityOptions" @click="modifyBucketRule(idx, option.value)">
                  <input type='radio' :value='option.value' v-model='item.act' />{{ option.name }}
                </span>
                <button @click="removeBucket(idx)" style="margin-left:5px;font-size: 13px;vertical-align:top;"
                  class="btn">删除</button>
              </td>
            </tr>
          </table>
          <div>
            <span style="margin-right:5px">添加</span>
            <input type="text" placeholder="用户id" v-model="addBucketRuleForm.userId" />
            <span v-for="(option, index) in bucketAuthorityOptions">
              <input type='radio' :value='option.value' v-model="addBucketRuleForm.act" />{{
                option.name
              }}
            </span>
            <button class="btn" style="margin-left:5px;font-size: 13px;vertical-align:top;"
              @click="addBucketRule">提交</button>
          </div>
        </div>
      </div>
    </el-dialog>
  </div>
</template>

<script setup>
import { getObjectsReq, getBucketReq, getPresignedUrlReq, modifyObjectStatusReq, addBucketRuleFormReq, modifyBucketRuleReq, removeBucketRuleReq, modifyBucketStatusReq, getBucketRuleReq, downloadObjectReq, removeObjectReq, searchObjectsByTxtReq } from './api'
import { computed, onMounted, reactive, ref } from 'vue';
import { userStore } from '@/store/user'
import { bucketStore } from '@/store/bucket'
import { UploadFilled } from '@element-plus/icons-vue'
import { useRouter } from 'vue-router';
import { ElMessage } from 'element-plus';
import config from "@/my-config.json"

const router = useRouter()
const bStore = bucketStore()
const uStore = userStore()


const fun = (e) => {
  console.log(e.target.value)
  // alert("Qwer")
  console.log(e)
}

//桶查询
const bucketQuery = reactive({
  pageNum: 1,
  pageSize: 8,
  name: "",
})

const searchBucket = () => {
  if (bucketQuery.name == "") {
    ElMessage.warning("输入为空")
    return;
  }
  getBucketReq({ bucket_id: bStore.id, bucket_name: bucketQuery.name }).then(res => {
    if (res.code == 200) {
      ElMessageBox.confirm(
        '确认跳转bucket吗？',
        'success',
        {
          confirmButtonText: '跳转',
          cancelButtonText: '取消',
          type: 'warning',
        }
      )
        .then(() => {
          let data = res.data;
          bStore.setName(data.bucket_name);
          bStore.setId(data.bucket_id);
          bStore.setUserId(data.user_id);
          curBucketAuthority.value = data.authority;
          curBucketStatus.value = data.status;
          refresh()
          ElMessage({
            type: 'success',
            message: '已跳转bucket',
          })
        })
        .catch(() => {
          ElMessage({
            type: 'info',
            message: '取消跳转',
          })
        })
    } else {
      ElMessage.error(res.message)
    }

  })
}

const doRefresh = () => {
  refresh()
  ElMessage.success("已刷新")
}

const back2MyBucket = () => {
  bStore.id = uStore.bucketId
  bStore.userId = uStore.id;
  refresh()
}

const refresh = () => {
  let param1 = {
    bucketId: bStore.id
  }
  getObjectsReq(param1).then(res => {
    console.log(res)
    let data = res.data;
    objectsData.value = data.objects;
  })
  let param2 = {
    bucket_id: bStore.id
  }
  if (bStore.userId != uStore.id) {
    param2.bucket_name = bStore.name;
  }
  getBucketReq(param2).then(res => {
    let data = res.data;
    bStore.setName(data.bucket_name);
    bStore.setUserId(data.user_id);
    curBucketStatus.value = data.status;
    curBucketAuthority.value = data.authority;
  })
}

//对象查询
const objectsQuery = reactive({
  keyword: "",
  annSearchImgByTxt: ""
})

const objectsData = ref([])

const filterTableData = computed(() =>
  objectsData.value.filter(
    (data) =>
      !objectsQuery.keyword ||
      data.name.toLowerCase().includes(objectsQuery.keyword.toLowerCase())
  )
)

const objectSearchOptions = reactive([
  { "name": "文本", "value": "txt" },
  { "name": "图片", "value": "image" }
])

const objectSearchType = ref("txt")



const searchObjectsByTxt = () => {
  if (objectsQuery.annSearchImgByTxt == "") {
    ElMessage.warning("输入为空")
    return;
  }
  let param = {
    "text": objectsQuery.annSearchImgByTxt,
  }
  let pathParam = {
    "bucketId": bStore.id,
  }
  tableLoading.value = true;
  searchObjectsByTxtReq(param, pathParam).then(res => {
    let data = res.data;
    objectsData.value = data.objects;
    tableLoading.value = false;
  })
}

const onBeforeSearchImgByImg = () => {
  tableLoading.value = true;
}

const onSearchImageByImageSuccess = (res) => {
  console.log(res)
  let data = res.data;
  objectsData.value = data.objects;
  tableLoading.value = false;
}



//对象上传
const upload_type = ref("file");

const upload_url = computed(() => (prefix) => { //计算属性传递参数
  if (upload_type.value == "file") {
    return prefix + "object"
  } else {
    return prefix + "img"
  }
})

const onUploadFileSuccess = (res) => {
  ElMessage.success("上传成功")
  let data = res.data;
  objectsData.value.push(data.object)
}


const removeObject = (index, row) => {
  ElMessageBox.confirm(
    '确认删除吗？',
    'Warning',
    {
      confirmButtonText: '删除',
      cancelButtonText: '取消',
      type: 'warning',
    }
  )
    .then(() => {
      let param = {
        "bucketId": row.bucket_id,
        "objectId": row.id
      }
      removeObjectReq(param).then(res => {
        objectsData.value.splice(index, 1);
        ElMessage({
          type: 'danger',
          message: '删除成功',
        })
      })

    })
    .catch(() => {
      ElMessage({
        type: 'info',
        message: '取消操作',
      })
    })
}

//对象下载
const __downloadObject = (bucketId, objectId) => {
  let link = config.configs[config.ENV].backend_path + "/object/" + bucketId + "/" + objectId
  let DownloadLink = document.createElement('a');
  DownloadLink.style = 'display: none'; // 创建一个隐藏的a标签
  DownloadLink.download = "object";
  DownloadLink.href = link;
  document.body.appendChild(DownloadLink);
  DownloadLink.click(); // 触发a标签的click事件
  document.body.removeChild(DownloadLink);
}
const downloadObject = (index, row) => {
  __downloadObject(row.bucket_id, row.id)
}

const multipleSelection = ref([])

const handleSelectionChange = (val) => {
  multipleSelection.value = val
}

const multipleDownload = () => {
  if (multipleSelection.value.length == 0) {
    ElMessage.warning("未选择文件");
  }
  multipleSelection.value.forEach(item => {
    __downloadObject(item.bucket_id, item.id)

  })
}


//桶权限
const bucketAuthorityDialogVisible = ref(false);



//获得访问链接
const presignedUrl = ref("")
const presignedUrlExpire = reactive([
  { name: "天", value: 1 },
  { name: "小时", value: 0 },
  { name: "分钟", value: 0 },
])

const presignedUrlDialogVisible = ref(false);

const getPresignedUrl = () => {
  // console.log(index)
  // console.log(row)
  let row = selectedRow.row;
  let index = selectedRow.index;
  let pathParam = {
    bucketId: row.bucket_id,
    objectId: row.id,
  }
  let param = {
    days: presignedUrlExpire[0].value,
    hours: presignedUrlExpire[1].value,
    minutes: presignedUrlExpire[2].value,
  }
  getPresignedUrlReq(pathParam, param).then(res => {
    let data = res.data
    presignedUrl.value = data.url;
  })
}

const showPresignedUrlDialog = (index, row) => {
  selectedRow.index = index;
  selectedRow.row = row;
  presignedUrlDialogVisible.value = true;
}

const closePresignedUrlDialog = () => {
  presignedUrlDialogVisible.value = false;
  presignedUrlExpire[0].value = 1;
  presignedUrlExpire[1].value = 0;
  presignedUrlExpire[2].value = 0;
  presignedUrl.value = "";
}

const copy2ClipBoard = () => {
  navigator.clipboard.writeText(presignedUrl.value).then(() => {
    console.log("复制成功")
  });
}



//对象预览

const previewDialogVisible = ref(false)
const previewUrl = ref("")

const showPreviewDialog = (index, row) => {
  selectedRow.row = row;
  selectedRow.index = index;
  previewUrl.value = config.configs[config.ENV].backend_path + "/object/" + row.bucket_id + "/" + row.id + "?preview=1"
  previewDialogVisible.value = true;
}

//桶开放状态
const curBucketStatus = ref(null)
const bucketStatusOptions = reactive([
  { "name": "部分公开", value: 1 },
  { "name": "私有", value: 0 }
])


const modifyBucketStatus = (newStatus) => {
  let pathParam = {
    "bucketId": bStore.id,
  }
  let param = {
    "bucket_status": newStatus
  }
  modifyBucketStatusReq(param, pathParam).then(res => {
    ElMessage.success("修改桶状态成功")
  })
}


//桶权限
const curBucketAuthority = ref("")

const bucketRules = ref([])

const computedBucketAuthority = computed(() => (item) => {
  if (item == "admin") {
    return "管理员"
  } else if (item == "onlyRead") {
    return "只读"
  } else if (item == "readWrite") {
    return "读写"
  } else {
    return "无权限"
  }
})

const bucketAuthorityOptions = reactive([
  { "name": "只读", value: "onlyRead" },
  { "name": "读写", value: "readWrite" },
])

const showBucketAuthorityDialog = () => {
  getBucketRule()
  bucketAuthorityDialogVisible.value = true;
}

const getBucketRule = () => {
  let param = {
    "bucketId": bStore.id
  };
  getBucketRuleReq(param).then(res => {
    let data = res.data;
    bucketRules.value = data.bucketRules
  })
}

const modifyBucketRule = (ruleIdx, newAct) => {
  let item = bucketRules.value[ruleIdx]
  let pathParam = {
    bucketId: bStore.id,
    userId: item.userId
  }
  let param = {
    act: newAct
  }

  modifyBucketRuleReq(pathParam, param).then(res => {
    console.log(res)
    ElMessage.success("修改桶的用户访问权限成功")
  })
}

const removeBucket = (idx) => {
  let item = bucketRules.value[idx]
  let param = {
    "bucketId": bStore.id,
    "userId": item.userId
  }
  removeBucketRuleReq(param).then(res => {
    bucketRules.value.splice(idx)
    ElMessage.success("删除成功")
  })
}

const addBucketRuleForm = reactive({
  userId: "",
  act: "onlyRead"
})

const addBucketRule = () => {
  let exist = addBucketRuleForm.userId == uStore.id;
  bucketRules.value.forEach(item => {
    if (item.userId == addBucketRuleForm.userId) {
      exist = true;
    }
  })
  if (exist) {
    ElMessage.error("该用户权限已存在")
    return;
  }
  let pathParam = {
    bucketId: bStore.id,
    userId: addBucketRuleForm.userId
  }
  let param = {
    act: addBucketRuleForm.act
  }
  addBucketRuleForm.act = "onlyRead"
  addBucketRuleForm.userId = ""
  addBucketRuleFormReq(pathParam, param).then(res => {
    if (res.code == 200) {
      ElMessage.success("添加成功")
      let newRule = {
        "userId": pathParam.userId,
        "act": param.act
      }
      bucketRules.value.push(newRule)
    } else {
      ElMessage.error("该用户不存在")
    }

  })
}

//对象权限
const modifyObjectStatus = (newStatus, item) => {
  console.log(newStatus)
  let param = {
    status: newStatus
  }
  let pathParam = {
    objectId: item.id
  }
  modifyObjectStatusReq(pathParam, param).then(res => {
    ElMessage.success("修改成功")
  })
}



const computedObjectAuthority = computed(() => (act) => { //计算属性传递参数
  if (act == "onlyRead") {
    return "只读"
  } else if (act == "readWrite") {
    return "读写"
  } else if (act == "admin") {
    return "全部"
  } else {
    return "无权限"
  }
})

onMounted(() => {
  refresh()
})

const tableLoading = ref(false);

const selectedRow = reactive({ index: 0, row: {} })

const logout = () => {
  uStore.removeUser()
  bStore.removeBucket()
  router.push("/login")
}
</script>
<style lang='less' scoped>
.objects {
  padding: 10px;

  .option-btn {
    margin: 5px;
    font-size: 16px;
    border: 1px solid whitesmoke;

  }

  .table {
    min-height: 70vh;
  }

  .preview-img {
    width: 100%;
  }

  .obejct-search-select {
    height: 28px;
    font-size: 13px;
    vertical-align: center;
  }

  .obejct-search-select:focus {
    outline: none;
  }

  .obejct-search-option {
    outline: none;
  }

  .bucket-search-input {
    outline: none;
    height: 22px;
    border: 1px solid rgb(91, 90, 90)
  }

  .obejct-search-input {
    height: 22px;
    outline: none;
  }

  .btn {
    background-color: white;
    border: 1px solid grey;
    cursor: pointer;
    vertical-align: middle;
    font-size: 17px;
    border-radius: 10%;

  }

  .btn:hover {
    background-color: whitesmoke;
  }

  .presigned-ur-copy-link {
    width: 23em;
    height: 25px;
    outline: none;
  }

  .presigned-ur-copy-btn {
    height: 31px;
    width: 83px;
    font-size: 17px;
    vertical-align: middle;
  }

  .presigned-ur-copy-btn:hover {
    background-color: whitesmoke;
  }

  .presigned-url-expire-selector {
    display: flex;
    flex-direction: column;
    width: 50%;

    .title {
      // font-size: 20px
      display: flex;
      justify-content: center;
      margin-bottom: 3px
    }

    .selector {
      display: flex;
      justify-content: center;

      input {
        border: 1px solid rgb(151, 151, 151);
        text-align: center;
        outline: none;
        height: 50px;
        width: 50px;
        font-size: 25px;
        border-radius: 10%;
      }

      input:focus {
        border: 1px solid red;
      }


    }
  }

}
</style>
