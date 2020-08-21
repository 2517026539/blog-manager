<template>
  <div class="article-pub">
    <sticky :z-index="9999" :class-name="'edit-sticky'" class="sticky_1">
      <el-button type="primary" @click="backList">返回</el-button>
      <el-button type="primary" class="button" @click.native="save">保存更新</el-button>
    </sticky>
    <el-form ref="article" class="article-form" :model="articleList" :rules="rules" label-width="70px">
      <div style="max-width: 600px">
        <el-form-item label="ID">
          <el-input v-model="articleList.id" disabled max="100px"></el-input>
        </el-form-item>
        <el-form-item label="标题" prop="title">
          <el-input v-model="articleList.title" placeholder="输入标题" :clearable="true" max="400px" />
        </el-form-item>
      </div>
      <el-form-item label="小标题" prop="subtitle">
        <el-input v-model="articleList.subtitle" type="textarea" placeholder="输入小标题" :clearable="true" />
      </el-form-item>
      <el-form-item label="文章" prop="content">
        <mavon-editor
          ref="markdown"
          v-model="articleList.content"
          :box-shadowstyle="true"
          :transition="true"
          :toolbars="toolbars"
          @imgAdd="handlerEditorImgAdd"
          @imgDel="handlerEditorImgDel"
          @change="handlerEditorChange"
        />
      </el-form-item>
      <el-form-item label="分类" prop="sort">
        <el-select v-model="articleList.sort" filterable placeholder="请选择文章分类">
          <el-option
            v-for="item in optionsList"
            :key="item.index"
            :label="item.sort"
            :value="item.sort"
          />
        </el-select>
        <el-button type="primary" :style="{marginLeft: '20px'}" @click="addTag">添加分类标签</el-button>
      </el-form-item>
      <el-form-item label="是否发布">
        <span :class="{yPub: articleList.pub === 1,nPub: articleList.pub === 0}">{{ articleList.pub | filterPub }}</span>
      </el-form-item>
      <el-form-item label="观看数">
        <el-input-number v-model="articleList.watch_num" :disabled="true" controls-position="right"/>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import sticky from './../../components/Sticky'
import { imageUpload, imageDel } from './../../api/image'
import { getClassification, getArticle, updateArticle } from '../../api/article'

export default {
  name: 'ArticlEdit',
  components: {
    sticky
  },
  filters: {
    filterPub: (value) => {
      if (value) {
        return '已发布'
      } else {
        return '未发布'
      }
    }
  },
  data() {
    const validateSubTitle = (rule, value, callback) => {
      if (value === '') {
        return callback(new Error('请输入文章小标题！'))
      } else {
        callback()
      }
    }
    const validateContent = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('文章内容不能为空！'))
      } else {
        callback()
      }
    }
    const validateSort = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请选择文章分类！'))
      } else {
        callback()
      }
    }
    const validateTitle = (rule, value, callback) => {
      if (!value) {
        return callback(new Error('请输入文章标题！'))
      } else {
        callback()
      }
    }
    return {
      articleList: {},
      optionsList: [],
      rules: {
        title: [{ required: true, validator: validateTitle }],
        subtitle: [{ required: true, validator: validateSubTitle }],
        content: [{ required: true, validator: validateContent }],
        sort: [{ required: true, validator: validateSort }]
      },
      imageList: [],
      toolbars: {
        bold: true, // 粗体
        italic: true, // 斜体
        header: true, // 标题
        underline: true, // 下划线
        strikethrough: true, // 中划线
        mark: true, // 标记
        superscript: true, // 上角标
        subscript: true, // 下角标
        quote: true, // 引用
        ol: true, // 有序列表
        ul: true, // 无序列表
        link: true, // 链接
        imagelink: true, // 图片链接
        code: true, // code
        table: true, // 表格
        fullscreen: true, // 全屏编辑
        readmodel: true, // 沉浸式阅读
        htmlcode: true, // 展示html源码
        help: true, // 帮助
        /* 1.3.5 */
        undo: true, // 上一步
        redo: true, // 下一步
        trash: true, // 清空
        /* 1.4.2 */
        navigation: true, // 导航目录
        /* 2.1.8 */
        alignleft: true, // 左对齐
        aligncenter: true, // 居中
        alignright: true, // 右对齐
        /* 2.2.1 */
        subfield: true, // 单双栏模式
        preview: true // 预览
      },
      id: ''
    }
  },
  watch: {
    $route: {
      handler: (to, from) => {
        /* getArticle({ id: to.params.id }).then(res => {
          console.log(res)
          console.log(this)
        }).catch(err => {
          console.log(err)
        })*/
      },
      immediate: true
    }
  },
  mounted() {
    this.init()
  },
  destroyed() {
    // console.log(1)
  },
  methods: {
    init() {
      this.getArticleSort()
      getArticle({ id: this.$route.params.id }).then(res => {
        console.log(res)
        this.articleList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    getArticleSort() {
      getClassification().then(res => {
        this.optionsList = res.data
      }).catch(err => {
        console.log(err)
      })
    },
    backList() {
      this.$router.push('/contents/list')
    },
    save() {
      this.$refs.article.validate(valid => {
        if (!valid) {
          console.log(valid)
        } else {
          this.$confirm('是否确定更新文章？', '确认信息', {
            confirmButtonText: '确认',
            cancelButtonText: '取消'
          }).then(() => {
            updateArticle(this.articleList).then(res => {
              this.$message({
                type: 'success',
                message: '文章更新成功'
              })
            }).catch(err => {
              this.$message({
                type: 'fail',
                message: err
              })
            })
          }).catch(() => {
            this.$message({
              type: 'info',
              message: '取消更新文章'
            })
          })
        }
      })
    },
    addTag() {
      console.log(1)
    },
    handlerEditorImgAdd(filename, imgfile) {
      const formatdata = new FormData()
      formatdata.append('image', imgfile)
      imageUpload(formatdata).then(res => {
        this.imageList.push(res.data)
        this.$refs.markdown.$img2Url(filename, res.data.urlpath)
      }).catch(err => {
        console.log(err)
      })
    },
    handlerEditorImgDel(filename) {
      let num = -1
      const file = this.imageList.find((item, index) => {
        if (item.urlpath === filename[0]) {
          num = index
          return true
        } else {
          return false
        }
      })
      imageDel(file).then(res => {
        console.log(res.msg)
        this.imageList.splice(num, 1)
        console.log(this.imageList)
      }).catch(err => {
        console.log(err)
      })
    },
    handlerEditorChange(value, render) {
      this.articleList.render = render
    }
  }
}
</script>

<style lang="scss" scoped>
  .article-pub {
    background-color: #f0f2f5;
    .sticky_1{
      text-align: right;
    }
    .article-form{
      padding: 30px;
    }
  }
</style>

