<template>
  <div>
    <div class="assets-container">
      <div
        class="asset-wrapper"
        v-for="(asset, index) in assetsToShow"
        :key="index"
      >
        <Asset
          :owner="asset.owner"
          :item="asset.item"
          :color="asset.color"
          :material="asset.material"
          :allowTransfer="allowTransfer"
        />
      </div>
    </div>
    <div
      v-observe-visibility="showMoreAssets"
      class="load-more-container"
    ></div>
  </div>
</template>

<script>
import Asset from './Asset.vue';

const COLORS = ['green', 'red', 'yellow', 'blue', 'black', 'brown', 'pink', 'orange', 'purple', 'gray'];
const MATERIALS = ['gold', 'wood', 'silver', 'fire', 'diamond', 'platinum', 'palladium', 'bronze', 'lithium', 'titanium'];
const ITEMS = ['sword', 'shield', 'robe', 'stone', 'crown', 'katana', 'dragon', 'ring', 'axe', 'hammer'];

function assetNameToObj(name) {
  const [color, material, item] = name.split(' ');
  return {
    color,
    material,
    item,
  };
}

function assetToStr(color, material, item) {
  return `${color} ${material} ${item}`;
}

const ASSETS_VISIBLE_CHUNK_SIZE = 40;

export default {
  name: 'Assets',

  props: {
    includeAssets: Array,
    showNotGeneratedAssets: Boolean,
    excludeAssets: Array,
    allowTransfer: Boolean,
  },

  data() {
    return {
      visibleAssets: {},
    };
  },

  methods: {
    showMoreAssets() {
      let counter = 0;
      const newVisibleAssets = { ...this.visibleAssets };

      for (const asset of this.assets) {
        if (counter >= ASSETS_VISIBLE_CHUNK_SIZE) {
          break;
        }

        if (!newVisibleAssets[asset.id]) {
          newVisibleAssets[asset.id] = asset;
          counter++;
        }
      }

      this.visibleAssets = newVisibleAssets;
    },
  },

  computed: {
    assets() {
      const result = [];
      if (this.showNotGeneratedAssets) {
        for (const color of COLORS) {
          for (const material of MATERIALS) {
            for (const item of ITEMS) {
              const asset = assetToStr(color, material, item);
              if (!this.excludeAssets.find((el) => el.name == asset)) {
                result.push({
                  color,
                  material,
                  item,
                  id: asset,
                });
              }
            }
          }
        }
      } else {
        for (const asset of this.includeAssets) {
          result.push({
            id: asset.name,
            owner: asset.owner,
            ...assetNameToObj(asset.name),
          });
        }
      }

      return result;
    },

    assetsToShow() {
      return Object.values(this.visibleAssets);
    },
  },

  watch: {
    includeAssets() {
      this.visibleAssets = {};
      this.showMoreAssets();
    },

    excludeAssets() {
      this.visibleAssets = {};
      this.showMoreAssets();
    },
  },

  components: {
    Asset,
  },
};
</script>

<style scoped lang="scss">
.assets-container {
  margin-top: 20px;
  margin-bottom: 20px;
  display: flex;
  column-gap: 30px;
  row-gap: 30px;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
