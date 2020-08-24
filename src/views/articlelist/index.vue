<template>
  <div class="article-list">
    <div class="article-list-header">
      <el-input v-model="checkList.title" @input="titleChange" class="article-list-header-input" placeholder="标题" />
      <el-input v-model="checkList.subtitle" @input="subTitleChange" class="article-list-header-input" placeholder="小标题" />
      <el-select v-model="checkList.sort" @change="selectSort" placeholder="分类">
        <el-option v-for="item in sortList" :key="item.index" :value="item.sort">
          {{ `${ item.sort }(${ item.num })` }}
        </el-option>
      </el-select>
      <el-button class="article-list-header-button" type="primary" @click="checkArticle">查询</el-button>
      <el-button class="article-list-header-button" type="primary" @click="writeArticle">编写文章</el-button>
    </div>
    <el-table
      :data="articleList"
      :fit="true"
      style="width: 100%;"
      class="article-list-content"
      :highlight-current-row="true"
      @sort-change="sortChange"
    >
      <el-table-column
        label="ID"
        align="center"
        sortable="custom"
        width="80px"
      >
        <template v-slot="scope">
          <span>{{ scope.row.id }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="标题"
        align="center"
        width="150px"
      >
        <template v-slot="scope">
          <div v-html="scope.row.title" />
        </template>
      </el-table-column>
      <el-table-column
        label="小标题"
        align="center"
        width="200px"
      >
        <template v-slot="scope">
          <el-popover
            trigger="hover"
            placement="top-start"
            width="250"
            title="小标题"
          >
            <div v-html="scope.row.subtitle" />
            <div slot="reference" class="subtitle" v-html="scope.row.subtitle" />
          </el-popover>
        </template>
      </el-table-column>
      <el-table-column
        label="内容"
        align="center"
        width="250px"
      >
        <template v-slot="scope">
          <p class="content">{{ scope.row.content }}<p/>
        </template>
      </el-table-column>
      <el-table-column
        label="render"
        align="center"
        width="250px"
      >
        <template v-slot="scope">
          <p class="content">{{ scope.row.render }}<p/>
        </template>
      </el-table-column>
      <el-table-column
        label="分类"
        align="center"
        width="80px"
      >
        <template v-slot="scope">
          <el-tag>{{ scope.row.sort }}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="是否发布"
        align="center"
      >
        <template v-slot="scope">
          <el-tag :class="{yPub: scope.row.pub === 1,nPub: scope.row.pub === 0}">{{ scope.row.pub | isPub}}</el-tag>
        </template>
      </el-table-column>
      <el-table-column
        label="观看数"
        align="center"
      >
        <template v-slot="scope">
          <span>{{ scope.row.watch_num }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="发布时间"
        align="center"
        sortable="custom"
        width="100px"
      >
        <template v-slot="scope">
          <span>{{ scope.row.pubdate | filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="编写时间"
        align="center"
        width="100px"
      >
        <template v-slot="scope">
          <span>{{ scope.row.createdate | filterTime }}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="更新时间"
        align="center"
        width="100px"
      >
        <template v-slot="scope">
          <span>{{ scope.row.updatedate | filterTime}}</span>
        </template>
      </el-table-column>
      <el-table-column
        label="操作"
        fixed="right"
        width="150px"
        align="center"
      >
        <template v-slot="scope">
          <el-button type="primary" icon="el-icon-edit" @click.native="editArticle(scope)" circle/>
          <el-button type="danger" icon="el-icon-delete" @click.native="del(scope)" circle/>
          <el-button :type="scope.row.pub === 0 ? 'success' : 'warning'" :icon="scope.row.pub === 0 ? 'el-icon-upload2' : 'el-icon-download'" @click.native="pubArticle(scope)" circle/>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      :total="pagination.total"
      :page-size="pagination.pageSize"
      :pager-count="5"
      :current-page="pagination.page"
      layout="total, prev, pager, next"
      @current-change="currentChange"
    />
  </div>
</template>

<script>
import { articleSort, getArticleList, delArticle, updatePub } from '../../api/article'
import debounce from '../../utils/debounce'
import moment from 'moment'

export default {
  name: 'ArticleList',
  filters: {
    isPub: (value) => {
      if (value === 1) {
        return '已发布'
      } else {
        return '未发布'
      }
    },
    filterTime: (value) => {
      return value ? moment(value).format('YYYY/MM/DD hh:mm') : '无'
    }
  },
  data() {
    return {
      checkList: {
        title: '',
        subtitle: '',
        sort: ''
      },
      sortList: [],
      articleList: [],
      pagination: {
        total: 0,
        pageSize: 6,
        page: 1
      },
      orderAble: '',
      debounceHandleChange: undefined,
      debounceHandleInput: undefined,
      debounceHandleCheck: undefined
    }
  },
  mounted() {
    this.init()
    this.debounceHandleChange = debounce(this.getArticle, 200, false)
    this.debounceHandleInput = debounce(this.getArticle, 300, false)
    this.debounceHandleCheck = debounce(this.getArticle, 300, false)
  },
  methods: {
    init() {
      articleSort().then(res => {
        this.sortList = res.data
      }).catch(err => {
        console.log(err)
      })
      this.getArticle()
    },
    getArticle() {
      getArticleList(this.getQuery()).then(res => {
        this.pagination.total = res.data.count
        let list = res.data.articleList
        if (this.checkList.title.trim() || this.checkList.subtitle.trim()) {
          list = this.lightHigh(list)
        }
        this.articleList = list
      }).catch(err => {
        console.log(err)
      })
    },
    lightHigh(list) {
      const isTitle = this.checkList.title.trim()
      const isSubTitle = this.checkList.subtitle.trim()
      if (isTitle) {
        list.forEach(item => {
          item.title = item.title.replace(new RegExp(`${isTitle}`, 'ig'), `<span class="text-lignt-high">${isTitle}</span>`)
        })
      }
      if (isSubTitle) {
        list.forEach(item => {
          item.subtitle = item.subtitle.replace(new RegExp(`${isSubTitle}`, 'ig'), `<span class="text-lignt-high">${isSubTitle}</span>`)
        })
      }
      return list
    },
    getQuery() {
      const query = {}
      Object.keys(this.pagination).reduce((pre, val) => {
        if (val !== 'total') {
          pre[val] = this.pagination[val]
        }
        return pre
      }, query)
      if (this.orderAble) {
        query.order = this.orderAble
      }
      Object.keys(this.checkList).forEach(item => {
        if (this.checkList[item].trim() !== '') {
          query[item] = this.checkList[item]
        }
      })
      return query
    },
    checkArticle() {
      this.debounceHandleCheck()
    },
    writeArticle() {
      this.$router.push('/article/edit')
    },
    sortChange({ column, order }) {
      if (column.label === 'ID') {
        this.orderAble = 'id'
      } else if (column.label === '发布时间') {
        this.orderAble = 'pubdate'
      }
      if (order === 'descending') {
        this.orderAble = `-${this.orderAble}`
      } else {
        this.orderAble = `+${this.orderAble}`
      }
      this.getArticle()
    },
    editArticle(scope) {
      console.log(scope)
      this.$router.push({ name: 'edit', params: { id: scope.row.id }})
    },
    del(scope) {
      this.$confirm(`此操作将永久删除<span style="color: red">id：${scope.row.id}</span>的文章，是否确定删除？`, '提醒', {
        confirmButtonText: '确认删除',
        cancelButtonText: '再考虑一下',
        dangerouslyUseHTMLString: true,
        type: 'warning'
      }).then(() => {
        delArticle({ id: scope.row.id }).then(res => {
          this.$message({
            type: 'success',
            message: '删除成功'
          })
          this.init()
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '取消删除'
          })
        })
      })
    },
    pubArticle(scope) {
      const pub = 1 - scope.row.pub
      const { id } = scope.row
      this.$confirm(`是否<span style="color: #3a835d">${pub ? '发布' : '下架'}id：${id}</span>的文章`, '温馨提示', {
        confirmButtonText: '确认',
        cancelButtonText: '取消',
        dangerouslyUseHTMLString: true
      }).then(() => {
        updatePub({ pub, id }).then(result => {
          this.$message({
            type: 'success',
            message: result.msg
          })
          this.getArticle()
        }).catch(err => {
          this.$message({
            type: 'error',
            message: err,
            duration: 200
          })
        })
      }).catch(() => {
        this.$message({
          type: 'info',
          message: '取消'
        })
      })
    },
    currentChange(page) {
      this.pagination.page = page
      this.getArticle()
    },
    titleChange() {
      this.debounceHandleInput()
    },
    subTitleChange() {
      this.debounceHandleInput()
    },
    selectSort() {
      this.debounceHandleChange()
    }
  }
}
</script>

<style lang="scss" scoped>
.article-list{
  padding: 0 20px 20px 20px;
  margin-bottom: 30px;
  .article-list-header{
    display: flex;
    flex-direction: row;
    flex-wrap: nowrap;
    align-items: center;
    justify-content: left;
    height: 66px;
    line-height: 66px;
    margin-bottom: 10px;
    .article-list-header-input {
      max-width: 300px;
      margin-right: 30px;
    }
    .article-list-header-button {
      margin-left: 20px ;
    }
  }
  .article-list-content {
    margin-bottom: 20px;
    .content {
      max-height: 70px;
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
    }
    .subtitle{
      max-height: 70px;
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    }
  }
}
</style>
