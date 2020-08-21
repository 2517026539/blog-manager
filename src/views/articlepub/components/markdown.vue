<template>
  <div class="markdown">
    <mavon-editor v-model="content"></mavon-editor>
  </div>
</template>

<script>
export default {
  name: 'Markdown',
  props: {
    content: {
      type: String,
      default: ''
    }
  },
  data() {
    return {
      value: ''
    }
  }
}
</script>

<style scoped>

</style>
