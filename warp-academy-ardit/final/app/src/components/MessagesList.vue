<script setup>
import { useContractStore } from '../stores/contract';
import TheLoader from './TheLoader.vue';
const store = useContractStore();

const addInteraction = async (functionType, msg) => {
  await store.voteInteraction(functionType, msg);
  store.getContract();
};
</script>

<template>
  <section>
    <div v-if="store.contractState.messages" class="content">
      <div
        class="message"
        v-for="msg in store.contractState.messages.slice().reverse()"
        :key="msg.id"
      >
        <p>{{ msg.content }}</p>
        <h3>
          <a
            target="_blank"
            :href="`https://viewblock.io/arweave/address/${msg.creator}`"
            >{{ msg.creator }}</a
          >
        </h3>
        <div class="votes-container">
          <div class="score">
            <p>{{ msg.votes.status }}</p>
          </div>
          <div class="icons">
            <div
              class="upvote"
              @click.prevent="addInteraction('upvoteMessage', msg)"
            >
              <img src="../assets/positive-vote.png" alt="upvote icon" />
            </div>
            <div
              class="downvote"
              @click.prevent="addInteraction('downvoteMessage', msg)"
            >
              <img
                src="../assets/positive-vote.png"
                alt="downvote icon"
                class="dislike"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
    <TheLoader v-else></TheLoader>
  </section>
</template>

<style lang="scss" scoped>
@import '../style/_colors';

.content {
  margin-top: 3rem;
  height: 80%;
  min-width: 50rem;
  width: 50rem;
  padding-bottom: 2.5rem;
  overflow: auto;

  display: flex;
  flex-direction: column;
  .message {
    width: 40rem;
    position: relative;
    display: flex;
    justify-content: center;
    flex-direction: column;
    margin: 2rem 0;
    padding: 1rem;

    background-color: $primary;
    border-radius: 0.5rem;
    p {
      font-size: 1.8rem;
      color: white;
    }
    h3 {
      margin-left: auto;
      margin-top: 1rem;
      a {
        color: white;
      }
    }

    .votes-counter {
      position: relative;
      top: 0;
      left: -3rem;
    }

    .votes-container {
      position: absolute;
      right: -6rem;
      top: 0;

      display: flex;
      flex-direction: row;
      .score {
        display: flex;
        align-items: center;
        color: $white;
        margin-right: 0.5rem;
        font-size: 2rem;
        p {
          display: inline-block;
        }
      }
      .upvote,
      .downvote {
        cursor: pointer;
        transition: transform 0.2s ease;

        &:hover {
          transform: scale(1.1);
        }
      }

      .dislike {
        transform: rotate(0.5turn);
      }
    }
  }
}
</style>
