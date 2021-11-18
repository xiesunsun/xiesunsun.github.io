---
layout: post
read_time: false
title: "Python与java在OOP方面的差异"
date: 2021-11-17
img: posts/2021-11-17/python.jpg
tags: [学习]
category: 学习
author: xiesunsun
description: "python！"
---
## 关于类文件命名
&nbsp;&nbsp;在java中规定类文件的名称必须跟文件中唯一的一个public类的类名一样，而在python中没有这个要求，保存python类的文件名与类名没有关系,但是文件名最好有具体的含义
## 关于python中类的格式
1. 与其他语言类似，约定首字母大写的名称指的是类
2. 同样具有构造函数，类变量，成员变量，类方法，成员方法
   
   ***如下图***
``` python
class Student:
    """学生类"""
    count=0
    def __init__(self,name,age):
        ''''初始化方法'''
        self.name=name
        self._age=age
    def getAge(self):
        return self.age
	@classmethod
	def getNum(cls):
		return cls.count
```
***同等效果的 java代码***
```java
package test;
public class Student {
	public static int  count=0;
	private int age;
	public String name;
	public Student() {
		// TODO Auto-generated constructor stub
	}//无参构造方法
	public Student(String name,int age)
	{
		this.name=name;
		this.age=age;
		count++;
	}
	public int getAge()
	{
		return this.age;
	}
	public static int getNum()
	{
		return count;
	}
}
```
## 关于指向该类的实例指针this,self，以及父类的super
&nbsp;&nbsp;java中的this,表示指向该类的实例对象，python中的self表示的创建类的实例本身，super都是指向父类的实例对象

## 关于构造方法，其他方法
&nbsp;&nbsp;java中的构造函数分为（默认），有参（支持重载），构造函数名与类名一致

&nbsp;&nbsp;python的构造函数为<font color=red>__init__</font>,其中形参<font color=red>self</font>f必不可少，创建实例时不需要传入该参数，python解释器会自动传入，python类中的方法都需要***显式带上self***参数，通过对象调用时不用传入该参数
``` python
class Student:
    """学生类"""
    count=0
    def __init__(self,name,age):
        ''''构造方法'''
        self.name=name
        self._age=age
    def getAge(self):#self必不可少
        return self.age
	@classmethod
	def getNum(cls):
		return cls.count
```
## 关于实例变量，类变量，类方法
&nbsp;&nbsp;在java中定义在类中的变量如果不是static修饰的，指的是实例变量（每个对象都会保存一份该变量，可以直接通过类名来访问）下图:Student类中的count在python中属于类变量，属于整个类，所有实例对象共同拥有一个count变量，相当于java中的实例变量（static修饰）,而age,name等在函数里通过self定义的变量称之为实例变量（需要通过实例对象来访问）。
``` python
class Student:
    """学生类"""
    count=0#类变量
    def __init__(self,name,age):
        ''''构造方法'''
        self.name=name#实例变量
        self._age=age
    def getAge(self):#self必不可少
        return self.age
	@classmethod
	def getNum(cls):
		return cls.count
```
&nbsp;&nbsp;类方法:java中的类方法通过static修饰，可以通过类名直接访问,python中的类方法和实例方法相似，它最少也要包含一个参数***cls***，Python 会自动***将类本身绑定给 cls 参数***和实例方法最大的不同在于，类方法需要使用＠classmethod修饰符进行修饰,如上图的***getNum()*** 方法



&nbsp;&nbsp;在根据类创建完成的对象仍可以通过对象名.属性名的情况下增加对于该实例变量的属性，如下例
```python
a=Student('xiaoming','17')
a.sex='男'
print(a.age)
```
## 关于对象的创建
&nbsp;&nbsp;java可以通过<font color=red>new</font>关键字来实现对象的实例化
python则通过类名来进行创建
```java
//java创建学生对象

  Student a=new Student("xiaoming",17);
```
```python
#python创建学生对象

   a=Student('xiaoming','17')
```
## 关于访问权限修饰符
java中有default,private,protected,public访问修饰符来控制类中属性的访问
python默认情况下类的所有成员变量都是public，如果需要，可以通过变量名前添加单个前缀_实现protected的效果，通过添加两个前缀__实现private效果，例如上面python student类的age属性
```java
//java访问修饰权限
	public static int  count=0;
	private int age;
	public String name;
```

```python
#python访问修饰权限
        self.name=name
        self._age=age
```
ps:对于python中"private"修饰的变量你仍然可以同过对象名._类名__属性名的方式进行访问操作

## 关于属性，方法的调用
&nbsp;&nbsp;java，python都可以通过实例对象.属性名(方法名)访问或者调用可见的方法

## 关于类继承
&nbsp;&nbsp;python通过类名后的括号()来实现，java通过关键字extend来实现，python也支持多继承
```python
class gstudent(Student):
    def __init__(self,name,age):
        super().__init__(name,age)
```
#### ps:运行时，会把该文件中所包含的类给事先加载到frame里去
## 参考博客
[Python中self用法详解](https://blog.csdn.net/CLHugh/article/details/75000104)

[Python实例方法、静态方法和类方法详解（包含区别和用法)](http://c.biancheng.net/view/4552.html#:~:text=Python%E7%B1%BB%E6%96%B9%E6%B3%95%20Python%20%E7%B1%BB%E6%96%B9%E6%B3%95%E5%92%8C%E5%AE%9E%E4%BE%8B%E6%96%B9%E6%B3%95%E7%9B%B8%E4%BC%BC%EF%BC%8C%E5%AE%83%E6%9C%80%E5%B0%91%E4%B9%9F%E8%A6%81%E5%8C%85%E5%90%AB%E4%B8%80%E4%B8%AA%E5%8F%82%E6%95%B0%EF%BC%8C%E5%8F%AA%E4%B8%8D%E8%BF%87%E7%B1%BB%E6%96%B9%E6%B3%95%E4%B8%AD%E9%80%9A%E5%B8%B8%E5%B0%86%E5%85%B6%E5%91%BD%E5%90%8D%E4%B8%BA,cls%EF%BC%8CPython%20%E4%BC%9A%E8%87%AA%E5%8A%A8%E5%B0%86%E7%B1%BB%E6%9C%AC%E8%BA%AB%E7%BB%91%E5%AE%9A%E7%BB%99%20cls%20%E5%8F%82%E6%95%B0%EF%BC%88%E6%B3%A8%E6%84%8F%EF%BC%8C%E7%BB%91%E5%AE%9A%E7%9A%84%E4%B8%8D%E6%98%AF%E7%B1%BB%E5%AF%B9%E8%B1%A1%EF%BC%89%E3%80%82)

[总结Java和Python面向对象的不同点](https://www.jianshu.com/p/7b8bf60def7e)

[python与java面向对象的比较](https://blog.csdn.net/qq_37584164/article/details/102645924)