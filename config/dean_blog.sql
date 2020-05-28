/*
 Navicat Premium Data Transfer

 Source Server         : localhost
 Source Server Type    : MySQL
 Source Server Version : 50726
 Source Host           : localhost
 Source Database       : dean_blog

 Target Server Type    : MySQL
 Target Server Version : 50726
 File Encoding         : utf-8

 Date: 05/28/2020 15:01:21 PM
*/

SET NAMES utf8;
SET FOREIGN_KEY_CHECKS = 0;

-- ----------------------------
--  Table structure for `act_admin`
-- ----------------------------
DROP TABLE IF EXISTS `act_admin`;
CREATE TABLE `act_admin` (
  `ID` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL,
  `password` varchar(32) NOT NULL,
  `role` varchar(32) DEFAULT NULL,
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=2 DEFAULT CHARSET=utf8 COMMENT='管理员表';

-- ----------------------------
--  Table structure for `act_article`
-- ----------------------------
DROP TABLE IF EXISTS `act_article`;
CREATE TABLE `act_article` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `title` varchar(255) NOT NULL,
  `description` varchar(255) NOT NULL COMMENT '描述',
  `content` text COMMENT '内容',
  `imgurl` varchar(32) DEFAULT NULL COMMENT '封面图片',
  `createtime` varchar(32) DEFAULT NULL,
  `mylike` int(5) NOT NULL DEFAULT '0' COMMENT '点赞',
  `comment` int(5) NOT NULL DEFAULT '0' COMMENT '评论数',
  `myread` int(5) NOT NULL DEFAULT '0' COMMENT '阅读数',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=59 DEFAULT CHARSET=utf8 COMMENT='文章表';

-- ----------------------------
--  Table structure for `act_comments`
-- ----------------------------
DROP TABLE IF EXISTS `act_comments`;
CREATE TABLE `act_comments` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `articleId` int(11) NOT NULL COMMENT '文章id',
  `articleTitle` varchar(255) DEFAULT NULL COMMENT '文章标题',
  `username` varchar(32) NOT NULL COMMENT '评论用户',
  `avatar` varchar(32) DEFAULT NULL,
  `content` varchar(255) DEFAULT NULL COMMENT '评论内容',
  `createtime` varchar(32) DEFAULT NULL COMMENT '评论时间',
  `mylike` int(10) NOT NULL DEFAULT '0' COMMENT '点赞数',
  `replyId` int(11) DEFAULT '0' COMMENT '回复评论id',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=50 DEFAULT CHARSET=utf8 COMMENT='用户评论表';

-- ----------------------------
--  Table structure for `act_message`
-- ----------------------------
DROP TABLE IF EXISTS `act_message`;
CREATE TABLE `act_message` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) DEFAULT NULL COMMENT '用户名',
  `avatar` varchar(32) DEFAULT NULL COMMENT '用户头像',
  `content` varchar(255) DEFAULT NULL COMMENT '留言内容',
  `createtime` varchar(32) DEFAULT NULL COMMENT '留言时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=23 DEFAULT CHARSET=utf8 COMMENT='用户留言表';

-- ----------------------------
--  Table structure for `act_user`
-- ----------------------------
DROP TABLE IF EXISTS `act_user`;
CREATE TABLE `act_user` (
  `ID` int(11) NOT NULL AUTO_INCREMENT,
  `username` varchar(32) NOT NULL COMMENT '用户名',
  `phone` varchar(11) NOT NULL COMMENT '用户注册手机号',
  `password` varchar(32) NOT NULL COMMENT '密码',
  `avatar` varchar(32) DEFAULT NULL,
  `createtime` varchar(32) DEFAULT NULL COMMENT '注册时间',
  PRIMARY KEY (`ID`)
) ENGINE=InnoDB AUTO_INCREMENT=13 DEFAULT CHARSET=utf8 COMMENT='前台用户表';

SET FOREIGN_KEY_CHECKS = 1;
