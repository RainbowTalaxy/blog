---
tags:
  - minecraft
  - mc
  - linux
  - ubuntu
---

# Ubuntu 基础

## 写在前面

本文旨在给想搭建 Minecraft 服务器的小白补一下 Ubuntu 的基础操作，方便教程的阅读。

本文大部分是命令的执行，命令执行中如果想取消执行请按 `Ctrl + C` 。同时，我希望读者稍微注意一下命令中空格的存在。

## `ssh` 命令

`ssh` 命令可以让你在本地登录到你的服务器上。

> 在这之前，如果你是云服务器，请确保设置了服务器登录密码。比如 "阿里云——轻量应用服务器" 的设置路径为：
>
> 1. 进入具体服务器的页面
> 2. 在右侧栏找到 "服务器运维——远程连接"
> 3. 找到 "设置密码" ，然后设置你的 root 账号的登录密码（在此之后会提示要重启服务器，需等待一分钟左右）
> 
> 你也可以使用阿里云的远程连接来越过 `ssh` 命令的时候，你需要输入 "su root" 来切换到 root 账户下。但是总之，我建议还是使用 `ssh` 命令进行远程连接。

在本地上打开 SSH 工具：

* Windows 用户可以用 Putty 、Mobaxterm 、Xshell ，但是我个人用的 Windows 自带的 PowerShell 工具
* Mac 和 Linux 用户可以直接使用 "终端（ Terminal ）"

命令的使用很简单：

```sh
# 请在 <IP_ADDRESS> 填入具体的服务器外网 IP 地址
ssh root@<IP_ADDRESS>
# 然后输入你的服务器密码
```

退出远程连接可以直接输入：

```sh
exit
```

如果你是第一次在本地登录到服务器，你可能会收到这样的消息：

```
The authenticity of host 'xx.xx.xx.xx (xx.xx.xx.xx)' can't be established.
ECDSA key fingerprint is SHA256:gwAfvN1oqcSBeHkvjdrhONNjP7JzkQbm98sCDke3XWo.
Are you sure you want to continue connecting (yes/no/[fingerprint])?
```

这是因为 `ssh` 的连接是公私钥加密的，第一次连接的时候需要互相交换公钥。这不重要，我们只要直接输入 `yes` 就行。（通常情况下这样就能登录进服务器了，如果出现警告试试重新执行 `ssh` 命令）

::: warning 报错：REMOTE HOST IDENTIFICATION HAS CHANGED!
在一些情况下执行 `ssh` 命令，你可能会收到这样的报错：

```
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
@    WARNING: REMOTE HOST IDENTIFICATION HAS CHANGED!     @
@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@
IT IS POSSIBLE THAT SOMEONE IS DOING SOMETHING NASTY!
Someone could be eavesdropping on you right now (man-in-the-middle attack)!
It is also possible that a host key has just been changed.
The fingerprint for the ECDSA key sent by the remote host is
SHA256:SBeHkvjdrhONNjxxxxxxxxxxP7JzkQbm98sCDke3XWo.
Please contact your system administrator.
Add correct host key in C:\\Users\\XXX/.ssh/known_hosts to get rid of this message.
Offending ECDSA key in C:\\Users\\XXX/.ssh/known_hosts:3
ECDSA host key for xx.xx.xx.xx has changed and you have requested strict checking.
Host key verification failed.
```

这是说明主机与服务器的之间的密钥损坏或缺失，一般重置服务器之后会遇到这个问题。解决方法也很简单，这里只列举 Windows 上的解决方法：

1. 进入你的用户文件夹，然后（确保菜单上 "查看 -> 隐藏的项目" 勾选上）进入 ".ssh" 文件
2. 这个时候你会看到一个 "known_hosts" 文件，选择用记事本打开
3. 如果你拉开窗口，你可以明显看出文件里每一行都记录着一个服务器的密钥信息
4. 请对照每行开头的 IP 地址，找到你的服务器地址，然后只需把该行删除即可。记得保存 `Ctrl + S` 再退出
5. 重新用 `ssh` 命令连接你的服务器
:::

上面说了这么多，其实最重要的还是这句 `ssh root@<IP_ADDRESS>` 。

## `cd` 和 `ls` 命令

`cd` 是 "change directory" 的缩写，意思为更改目录（或者叫文件夹）。在你每一次命令输入的前面总是会有类似的东西：

```
root@iZruXxxnc5c1fmZ:~# 
```

这里的 root 指的是当前账户为 root ，而后面的 iZruXxxnc5c1fmZ 为你服务器的主机名，这两个其实都不重要。但冒号后面有个 `~` ，其实它是一个目录信息，指你当前在 `~` 目录（用户文件夹的别名）中。如果你输入命令 `cd /home` ，会发现冒号后面变成了 `/home` 目录。总而言之，当你在输入命令的时候，你要意识到你是在某个目录中执行命令。

所以，`cd` 的命令很简单：

```sh
# 切换当前的文件目录路径
cd 目录路径
```

而 `ls` 命令会展示你当前目录有哪些文件：

```sh
ls

# 查看具体文件信息可以用
ls -al 
# 或者
ll
```

::: tip 技巧
你可以在命令行里用上下键调用历史命令，或者输入 `history` 查看历史命令。

在输入文件名的时候你可以按 `Tab` 键自动补全文件名称（文件名不唯一的时候会提示你有多种文件名）。
:::

还有一些实用的命令，可以在服务器上试一试：

```sh
# 查看当前目录路径
pwd

# 切换到上级目录
cd ..

# 切换到系统根目录
cd /

# 切换到用户目录
cd

# 切换到 home 目录
cd /home

# 切换到当前目录下的某个目录
cd 目录名

# 查看当前目录下的某个目录的内容
ls 目录名
```

### 绝对路径和相对路径

上面的 `/home` 其实就是一个绝对路径，而相对路径则是相对当前目录。比如这样的文件目录结构：

```sh
# home 和 d 是目录，其他都是文件
home
├── a1.txt
├── a2.txt
├── a3.txt
└── d
   ├── e1.txt
   ├── e2.txt
   └── e3.txt
```

我用几个情境来描述下**绝对路径**和**相对路径**

* 假设当前目录为 `/home` ，那么 e1.txt 的相对路径为 `d/e1.txt`，绝对路径始终为 `/home/d/e1.txt`
* 假设当前目录为 `/home/d`，那么 e1.txt 的相对路径为 `e1.txt`，绝对路径始终为 `/home/d/e1.txt`

Linux 里还有一些别的绝对路径，但我们只要了解 `/home` 即可。

如果你使用 `ls -al` ，你可能会注意到前两个似乎没有名字：

```
total 16
drwxr-xr-x  4 root  root  4096 Jun  9 21:09 .
drwxr-xr-x 22 root  root  4096 Jun  5 01:36 ..
drwxr-xr-x  5 admin admin 4096 Jun  9 16:42 admin
drwxr-xr-x  7 root  root  4096 Jun  9 20:36 server
```

但其实，第一个名字为 `.` 为当前目录，第二个名字为 `..` 为上级目录，它们都是合法的目录。所以我们可以用 `cd .` 来切换至当前目录（没有任何效果），`cd ..` 切换至上级目录。

> 在 Minecraft 部署中，我们会把服务器文件放在 `/home` 目录，所以在 `ssh` 后一般就 `cd /home` 。

## `mkdir`、`rm`、`cp`、`mv` 命令

`mkdir` 即 "make directory" ，创建目录：

```sh
# 创建文件
touch 文件名

# 创建目录
mkdir 目录名
```

`rm` 用来删除文件或目录：

```sh
# 删除单个文件
rm 文件路径

# 删除整个目录
rm -r 目录路径
```

> 建议在文件没有被使用的情况下删除文件。比如我们服务器在运行的时候不要删除服务器文件。

`cp` 用来复制文件：

```sh
# 复制单个文件
cp 源文件路径 目标文件路径

# 复制整个目录
cp -r 源目录路径 目标目录路径

# 举个例子，如果要复制当前目录的 "1.txt" 到当前目录，命名为 "2.txt"
cp 1.txt 2.txt
```

`mv` 用来更改文件或目录名，或者（本质是）迁移文件或目录位置：

```sh
# 复制单个文件
mv 源文件/目录路径 目标文件/目录路径

# 举例，将当前目录下的 "server" 目录更名为 "haha"
mv server haha

# 举例，将当前目录下的 "abc.txt" 文件迁移到 "/home/server" 目录下
mv abc.txt /home/server
# 如果同时想更名为 "123.txt"
mv abc.txt /home/server/123.txt
```

其实这些命令的使用方式在一些方面都是相通的，可以自己在服务器上尝试尝试。在进行文件操作时，要注意文件覆盖的问题（如果执行命令的时候出现覆盖问题，终端会询问你是否继续）。

## `apt-get` 和 `wget` 命令

`apt-get` 命令用到的情况很少，可以稍微了解以下。该命令用来下载软件包，跟我们平常在应用商店安装应用一样。使用方法如下：

```sh
# 安装软件包
apt-get install 软件包名
# 安装的时候它可能会询问你是否确认，输入 y 回车即可

# 删除软件包
apt-get remove 软件包

# 更新包信息，安装失败的时候可以试试更新包信息
apt-get update
```

`wget` 命令用来从网络下载文件，比如下载 Minecraft 服务器文件到当前目录：

```sh
# 使用的时候注意当前的目录路径
wget https://minecraft.azureedge.net/bin-linux/bedrock-server-1.17.0.03.zip
```

## `zip` 和 `unzip` 命令

这两个命令分别用来压缩和解压缩文件，在使用之前我们需要去安装这两个命令：

```sh
# 先进行软件包更新，防止找不到软件包信息
apt-get update

apt-get install zip
apt-get install unzip
```

`zip` 和 `unzip` 命令的使用：

```sh
# 将 "文件1 文件2 文件3 ..." 压缩为 "新文件"，其中新文件可以不加后缀 ".zip"
zip -r 新文件 文件1 文件2 文件3 ...

# 将当前目录下所有文件压缩
zip -r 新文件 *

# 解压缩 zip 文件，请注意文件覆盖的问题！（系统会询问是否覆盖原文件）
unzip 文件名
```

> 这里我还是想提一下，命令中 `-r` 是个标签，一般表示"需要进行文件的递归操作"，如果缺少这个标签去压缩文件，当你解压缩的时候会发现所有文件夹都是空的！但如果你要压缩的东西没有文件夹，那么可以放心的去掉这个标签。

## `vim` 的使用

`vim` 是终端里的文本编辑器，使用起来需要一定的技巧，但是对于新手来说，只需了解几个操作即可：

::: danger 请不要擅自按键盘上的任何键位，或者中途 `Ctrl + C`
因为 `vim` 作为文本编辑器，不仅能编辑文本，还有一堆七七八八的功能，任何按键都可能是 `vim` 的操作键。后续的操作请务必跟着教程来。
:::

这里我们尝试来新建一个 hello 文件，然后编辑内容为 "Love Minecraft!"：

1.  用 `vim` 临时新建一个 hello 文件

    ```sh
    vim hello
    ```

2.  这个时候你会看到类似这样的界面：

    ```
    
    ~
    ~
    ~
    ~
    "hello" [New File]                  0,0-1         All
    ```

    这里 `~` 表示无内容，然后最底下有个 `[New File]` 表示我们新创建了 hello 文件

3.  我们按键盘上的 `i` 键（表示插入 insert ），可以发现最底下的 `"hello" [New File]` 变为了 `-- INSERT --` ，这表示我们进入了编辑模式。我们可以在这个模式下对文件进行编辑，比如输入 "Love Minecraft!" ：

    ```
    Love Minecraft!
    ~
    ~
    ~
    ~
    -- INSERT --                        1,16          All
    ```

    > 不管是编辑还是非编辑模式，都可以按上下左右键来移动光标。

4. 编辑完毕后，我们需要按下键盘上右上角的 `Esc` 键来退出编辑模式，这个时候底部状态又会发生变化：

    ```
    Love Minecraft!
    ~
    ~
    ~
    ~
                                        1,15          All
    ```

5. 确保退出编辑模式后，在键盘上输入 `:wq` ，回车后我们便退出了文本编辑。这里 "wq" 表示 "write quit"

> 上面的例子中我们通过 `vim` 新建了一个文件来进行编辑，当然已存在的文件也是可以进行编辑的，请放心食用。

对于上面的 `:wq` ，其实还有几种选项：

* 如果你只是单纯浏览文件而没有做任何的编辑，你可以输入 `:q` 直接退出
* 如果你编辑了文件，但是后悔了不想保存，可以输入 `:q!` 直接退出

这里还是建议小白先在服务器上试试 `vim` 操作，再去尝试编辑重要的文件。编辑过程中请不要按 `Ctrl + C` 来强制退出。

## `sftp` 的使用

这个命令一般在本地使用，用来进行本地和服务器的文件传输。

> 如果你用的是别的 SSH 工具，可能自带文件传输的功能（直接拖拽文件），你可以百度它们的用法。

用法和 `ssh` 一致：

```sh
# 请在 <IP_ADDRESS> 填入具体的服务器外网 IP 地址
sftp root@<IP_ADDRESS>
# 然后输入你的服务器密码

# 退出
exit
```

进入之后的界面和 `ssh` 不太一样，总是以 `sftp>` 开头。同时 `sftp` 只支持一些比如 `pwd`、`cd`、`ls`、`mkdir`、`rm` 等基本的文件操作。但这里我要说的是，在这个命令行里也有 "当前目录" 的概念，所以在传输文件的时候请注意目录路径的问题。

两个核心的文件传输命令：

* `put` 将文件从本地上传至服务器
* `get` 将文件从服务器下载到本地

不管进行哪个命令，我都建议先使用 `cd` 命令切换服务器的当前目录。如果有多个文件，非常建议**先压缩再进行传输**。

### 上传文件

1. 使用 `cd` 命令切换服务器的当前目录，即文件的上传位置。你可以使用 `pwd` 命令检查当前目录。
2. 输入 `put -r 本地文件路径` 来传输文件至云端。获取本地文件路径，对于 Windows 可以右键复制文件（ `Ctrl + C` ），然后粘贴（直接右键或者 `Ctrl + V` ）在命令 `put -r ` 的后面。对于 Mac 和 Linux 则可以直接将文件拖拽到终端里，它会自动变成路径。

> 你也可以输入 `put -r 本地文件路径 服务器目录` 来指定上传到服务器的具体位置，但我还是建议使用 `cd` 命令更改当前目录。

### 下载文件

和上传文件步骤类似，使用 `get -r 服务器文件 本地文件路径` 。这里本地文件路径也是可以不用填的，但是我建议大部分情况下请粘贴这个路径！

## `screen` 命令

一般情况下，如果你想执行会一直运行下去的命令（比如启动 Minecraft 服务器），你将面临一个问题：**怎样在退出远程连接的同时能让服务器命令继续运行？**

通常情况下，你在运行这类命令的时候，是不能做任何事的，你只能用 `Ctrl + C` 。（当然事实上是有方法的，这里只是阐述一个情境）

而 `screen` 则会提供给你一个虚拟窗口（或者可以说是"空间"），来执行你那些会持久运行下去的命令。`screen` 的使用是需要一些技巧的。在这之前你需要安装 `screen` 命令：

```sh
apt-get install screen
```

1.  输入 `screen -S 窗口名` ，这里 "窗口名" 自行定义，但要确保记住。之后你会来到一个新的窗口
2.  在这个窗口中，你可以执行一些会持久运行下去的命令。执行完之后，按下 `Ctrl` 的同时连续按 `A` `D` 这两个键来退出窗口。
3.  在这之后如果你想回到这个窗口，输入 `screen -r 窗口名` 即可。
4.  如果你想终止这个虚拟窗口，先回到这个窗口，然后（也许你需要先 `Ctrl + C` 结束当前命令）输入 `exit` 即可。

## 结束语

恭喜，如果你认真看完并实际上手实践了话，此时的你已经是个出色的服务器运维小帮手了。接下来可以尝试去部署 Minecraft 服务器了。

最后，感谢阅读！