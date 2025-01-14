---
layout: home

hero:
  name: 风梨团队
  tagline: 始终致力于为良好开源生态而努力
  image:
    src: https://api.flweb.cn/logos/logo.webp
    alt: MCJPG组织
  actions:
    - theme: brand
      text: 加入我们
      link: https://qm.qq.com/cgi-bin/qm/qr?_wv=1027&k=djBfZaOL48fytzDyifpU9pcNeRBqrYlN&authKey=NUyh%2BZclnM9q7t9da7qKpYw%2FNwSaNiU2oxg0WnoZS7AV70BOF%2BMYC41VFrYzp74E&noverify=0&group_code=475823621
    - theme: alt
      text: View Us on GitHub
      link: https://github.com/WindyPear-Team
---
<script>
export default {
  mounted() {
    this.shuffleElements();
    // 如果确实需要在挂载后调用 reload() 方法，确保该方法已经定义
    // this.reload();
  },
  methods: {
    shuffleElements() {
      const elements = Array.from(document.querySelectorAll('div.VPFeatures .container .items .item'));
      const parent = document.querySelector('div.VPFeatures .container .items');

      for (let i = elements.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        const temp = elements[i];
        elements[i] = elements[j];
        elements[j] = temp;
      }

      // 清空父元素并将重新排序后的元素添加到父元素中
      parent.innerHTML = '';
      elements.forEach(element => {
        parent.appendChild(element);
      });
    }
  }
}
</script>
