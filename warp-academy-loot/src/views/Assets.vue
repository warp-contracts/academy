<template>
  <div>

    <div v-if="!loadingAssets" class="checkbox-container">
      <v-checkbox
        size="small"
        v-model="showNotGenerated"
        label="Show available assets first"
      ></v-checkbox>
    </div>

    <div v-if="showNotGenerated" class="not-generated-assets">
      <h2>Available assets ({{ 1000 - generatedAssets.length }})</h2>
      <Assets :showNotGeneratedAssets="true"  :excludeAssets="generatedAssets" />
      <div v-if="showNotGenerated" class="line-container">
        <hr />
      </div>
    </div>

    <div class="generated-assets">
      <h2>Generated assets ({{ generatedAssets.length }})</h2>
      <div v-if="loadingAssets">
        <vue-loaders-ball-beat color="gray" scale="1"></vue-loaders-ball-beat>
      </div>
      <Assets v-else :showNotGeneratedAssets="false" :includeAssets="generatedAssets" :excludeAssets="[]" />
    </div>

  </div>
</template>

<script>
import Assets from '@/components/Assets.vue'
import { mapState } from 'vuex'

export default {
  name: "AssetsPage",

  data() {
    return {
      loadedAssets: {},
      showNotGenerated: false,
    }
  },

  computed: {
    ...mapState(['state', 'validity', 'loadingAssets']),
    generatedAssets() {
      if (this.state.assets) {
        return Object.entries(this.state.assets).map(([name, owner]) => ({
          name,
          owner,
        }))
      }
      return []
    }
  },

  components: {
    Assets,
  },
}
</script>

<style>
label.v-label {
  left: 10px !important;
  top: 1px;
}

</style>

<style lang="scss" scoped>

.checkbox-container {
  margin: auto;
  margin-bottom: 20px;
  border: 1px solid #ddd;
  width: 280px;
  padding-left: 20px;
  padding-right: 20px;
  transform: scale(0.8);
  border-radius: 3px;
}

.line-container {
  hr {
    max-width: 80vw;
    margin: auto;
    margin-top: 40px;
    margin-bottom: 30px;
    border: none;
    border-bottom: 1px solid #ddd;
  }
}

</style>