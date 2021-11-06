---
layout: post
read_time: true
title: "MARKDOWN用法"
date: 2021-11-6
img: posts/2021-11-6/2021-11-06-21-10-39.png
tags: [杂,教程]
category: 观点
author: xiesunsun
description: "就是一个简单的介绍操作！"
---
# 标题
## 二级标题
### 三级标题   
#### 四级标题
依次类推

1. 正文直接写就好了，但要注意如果要换行的话，是需要空一行才可以的！
```C
 #include<stdio.h>
 int main(void)
 {
     for(int i=0;i<100;i++)
     {
         printf("now value is %d\n",i);
     }
     return 0;
 }
```
2. python代码可以这么写
```python
def printnum():
    for i in range(10):
        if i%2==0:
            print(i)
        else:
            continue
if __name__=="__main__":
    num=[x for x in range(100)]
    printnum()
```
3. 我只能说一句话markdown太厉害了，牛！

多级列表的产生
1. 注意需要在序号的后面需要加上一个空格才会产生列表的效果
   1. 产生多级的效果需要在指定的上一级标签后回车，加tab键产生效果

无序列表的操作
- 一个横线加上一个空格就可以生成
  - 同样是支持多级的无序列表的，与有序列表的操作是相同的

**这样是加粗的操作，要用到两个星号**

*这样是斜体的操作，注意只需要用到一个星号*

***这样是既加粗有斜体的操作***

插入表格的操作

| 表头 | 表头 |
| ----  | --- |
| 表格内容 | 可以写的不整齐但是它是会自动把你变成一个封闭的表格的

**插入图片需要注意相应的路径，可以使用插件past image 还是挺好用的！**
![](assets/img/../../../_site/assets/img/posts/2021-11-6/2021-11-06-21-10-39.png)

**给指定文字超链接**

例如这里我给[百度](https://www.baidu.com)这个文字超链接 