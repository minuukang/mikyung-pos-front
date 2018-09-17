<template>
  <div :class="$style.container">
    <div :class="$style.content">
      <v-icon name="user-times" :class="$style.icon"></v-icon>
      <p :class="$style.message">데이터가 없습니다!</p>
    </div>
  </div>
</template>
<style lang="scss" module>
  .container {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    height: 100%;
  }
  .content {
    text-align: center;
  }
  .icon {
    font-size: 10em;
    color: darken(#98d3ff, 20%);
  }
  .message {
    font-size: 18px;
    color: #6f6f6f;
    margin-top: 5px;
  }
</style>
