import { Indicator, MessageBox } from 'mint-ui';
import Vue from 'vue';

function errorThrow(timeout: number) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      reject(new Error('오류가 발생하였습니다! 관리자에게 문의해주세요'));
    }, timeout);
  });
}

export function confirmMessage(title: string, locate?: any, beforeCallback?: () => Promise<void>) {
  return function confirmMessageWrapper(target: any, key: string, descriptor: PropertyDescriptor) {
    const fn: () => void = descriptor.value;
    descriptor.value = async function confirmMessageAction(this: Vue, ...args: any[]) {
      if (beforeCallback) {
        await beforeCallback.call(this);
      }
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
        await Promise.race([
          fn.apply(this, args),
          errorThrow(10000),
        ]);
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
    };
  };
}
