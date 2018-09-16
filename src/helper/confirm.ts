import { Indicator, MessageBox } from 'mint-ui';
import Vue from 'vue';

export function confirmMessage(title: string, locate?: any) {
  return function (target: any, key: string, descriptor: PropertyDescriptor) {
    const fn: Function = descriptor.value
    descriptor.value = async function (this: Vue, ...args: any[]) {
      await MessageBox({
        $type: 'confirm',
        title: '안내',
        message: `정말로 ${title}하시겠습니까?`,
        showCancelButton: true,
        confirmButtonText: '확인',
        cancelButtonText: '취소',
      });
      try {
        Indicator.open(`${title}중...`);
        await fn.apply(this, args);
        Indicator.close();
        await MessageBox({
          title: '안내',
          message: `${title}(이)가 완료되었습니다!`,
          confirmButtonText: '확인',
        });
        if (locate) {
          this.$router.push(locate);
        }
      } catch (e) {
        await MessageBox({
          title: '안내',
          message: e.message,
          confirmButtonText: '확인',
        });
      } finally {
        this.$root.$emit('refresh');
      }
    }
  }
}
