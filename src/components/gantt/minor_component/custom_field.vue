<template>
    <el-col :span="24">
        <el-collapse v-model="openCustomField">
          <el-collapse-item title="Custom Field" name="1">
            <div>Consistent with real life: in line with the process and logic of real life, and comply with languages and habits that the users are used to;</div>
            <div>Consistent within interface: all elements should be consistent, such as: design style, icons and texts, position of elements, etc.</div>
          </el-collapse-item>
        </el-collapse>
    </el-col>
</template>

<script>
  export default {
      name: 'custom_field',
      data(){
          return {
              openCustomField: ['1'],

          }
      }
  };
</script>

<style scoped>

</style>
