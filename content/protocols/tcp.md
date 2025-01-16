# Tcp 协议

> 2025-01-16 在整理 TCP 协议时，得知陈皓于 2023 年 5 月 15 日去世的消息，虽然我没有见过他的面，他也不认识我，但是我还是感到非常难受！
> 我的浏览器收藏夹还有他的酷壳网站（coolshell.cn），左耳朵耗子，我读得他的最后一篇文章是《感染新冠的经历》，可惜他已离我远去。我从他的文章学到了很多，他的一些文章深深的影响了我，不仅仅是技术，还有精神。我敬佩他，敬佩他的技术价值观。
> 实在不想他就此离我远去，人生真是反复无常。
> 耗子大哥，走好，感谢人生路上有你。

强烈推荐浏览耗子大哥写的《TCP 的那些事儿》。

TCP 协议头格式：

![alt TCP 协议格式](https://gitee.com/littletow/visit/raw/master/content/images/tcp-header.png)TCP 头格式（[图片来源](http://nmap.org/book/tcpip-ref.html)）

TCP 的包没有 IP 地址，只有源端口和目标端口，它会被 IP 协议封装成 IP 数据包。

我们经常说四元组，一个 TCP 连接是由四元组组成的，它是（src_ip,src_port,dst_ip,dst_port）。

操作系统，已经为我们实现了网络协议，我们仅仅是调用即可。

我们需要记住的是，网络上的传输是没有连接的，包括 TCP 也是一样的。而所谓的“连接”，其实只是在通讯的双方主机上维护的一个“连接状态”，让它看上去好像有连接一样。所以，TCP 的状态变换是非常重要的。

TCP 状态有：TCP 建立连接，TCP 断开连接，TCP 传输数据。

看下图片：

![alt TCP状态转换](https://gitee.com/littletow/visit/raw/master/content/images/tcpfsm.png)

为什么需要三次握手？为什么需要四次挥手？

**对于建链接的 3 次握手，** 主要是要初始化 Sequence Number 的初始值。通信的双方要互相通知对方自己的初始化的 Sequence Number（缩写为 ISN：Inital Sequence Number）——所以叫 SYN，全称 Synchronize Sequence Numbers。也就上图中的 x 和 y。这个号要作为以后的数据通信的序号，以保证应用层接收到的数据不会因为网络上的传输的问题而乱序（TCP 会用这个序号来拼接数据）。

**对于 4 次挥手，** 其实你仔细看是 2 次，因为 TCP 是全双工的，所以，发送方和接收方都需要 Fin 和 Ack。只不过，有一方是被动的，所以看上去就成了所谓的 4 次挥手。如果两边同时断连接，那就会就进入到 CLOSING 状态，然后到达 TIME_WAIT 状态。下图是双方同时断连接的示意图（你同样可以对照着 TCP 状态机看）

![alt TCP打开关闭连接](https://gitee.com/littletow/visit/raw/master/content/images/tcp_open_close.jpg)

下面的一些问题也请注意：

**关于建连接时 SYN 超时。** 试想一下，如果 server 端接到了 clien 发的 SYN 后回了 SYN-ACK 后 client 掉线了，server 端没有收到 client 回来的 ACK，那么，这个连接处于一个中间状态，即没成功，也没失败。于是，server 端如果在一定时间内没有收到的 TCP 会重发 SYN-ACK。在 Linux 下，默认重试次数为 5 次，重试的间隔时间从 1s 开始每次都翻售，5 次的重试时间间隔为 1s, 2s, 4s, 8s, 16s，总共 31s，第 5 次发出后还要等 32s ，直到知道第 5 次也超时了，所以，总共需要 1s + 2s + 4s+ 8s+ 16s + 32s = 2^6 -1 = 63s，TCP 才会把断开这个连接。

**关于 SYN Flood 攻击。** 一些恶意的人就为此制造了 SYN Flood 攻击，给服务器发了一个 SYN 后，就下线了，于是服务器需要默认等 63s 才会断开连接，这样，攻击者就可以把服务器的 syn 连接的队列耗尽，让正常的连接请求不能处理。于是，Linux 下给了一个叫 tcp_syncookies 的参数来应对这个事。当 SYN 队列满了后，TCP 会通过源地址端口、目标地址端口和时间戳打造出一个特别的 Sequence Number 发回去（又叫 cookie），如果是攻击者则不会有响应，如果是正常连接，则会把这个 SYN Cookie 发回来，然后服务端可以通过 cookie 建连接（即使你不在 SYN 队列中）。请注意，请先千万别用 tcp_syncookies 来处理正常的大负载的连接的情况。因为，synccookies 是妥协版的 TCP 协议，并不严谨。对于正常的请求，你应该调整三个 TCP 参数。第一个是：tcp_synack_retries 可以用他来减少重试次数；第二个是：tcp_max_syn_backlog，可以增大 SYN 连接数；第三个是：tcp_abort_on_overflow 处理不过来干脆就直接拒绝连接了。

**关于 ISN 的初始化。** ISN 是不能硬编码的，不然会出问题的。比如：如果连接建好后始终用 1 来做 ISN，如果 client 发了 30 个 segment 过去，但是网络断了，于是 client 重连，又用了 1 做 ISN，但是之前连接的那些包到了，于是就被当成了新连接的包，此时，client 的 Sequence Number 可能是 3，而 Server 端认为 client 端的这个号是 30 了。全乱了。RFC793 中说，ISN 会和一个假的时钟绑在一起，这个时钟会在每 4 微秒对 ISN 做加一操作，直到超过 2^32，又从 0 开始。这样，一个 ISN 的周期大约是 4.55 个小时。因为，我们假设我们的 TCP Segment 在网络上的存活时间不会超过 Maximum Segment Lifetime（缩写为 MSL – Wikipedia 语条），所以，只要 MSL 的值小于 4.55 小时，那么，我们就不会重用到 ISN。

**关于 MSL 和 TIME_WAIT。** 通过上面的 ISN 的描述，相信你也知道 MSL 是怎么来的了。我们注意到，在 TCP 的状态图中，从 TIME_WAIT 状态到 CLOSED 状态，有一个超时设置，这个超时设置是 2 MSL（RFC793 定义了 MSL 为 2 分钟，Linux 设置成了 30s）。为什么要这有 TIME_WAIT？为什么不直接给转成 CLOSED 状态呢？主要有两个原因：1）TIME_WAIT 确保有足够的时间让对端收到了 ACK，如果被动关闭的那方没有收到 Ack，就会触发被动端重发 Fin，一来一去正好 2 个 MSL，2）有足够的时间让这个连接不会跟后面的连接混在一起（你要知道，有些自做主张的路由器会缓存 IP 数据包，如果连接被重用了，那么这些延迟收到的包就有可能会跟新连接混在一起）。

**关于 TIME_WAIT 数量太多。** 从上面的描述我们可以知道，TIME_WAIT 是个很重要的状态，但是如果在大并发的短链接下，TIME_WAIT 就会太多，这也会消耗很多系统资源。只要搜一下，你就会发现，十有八九的处理方式都是教你设置两个参数，一个叫 tcp_tw_reuse，另一个叫 tcp_tw_recycle 的参数，这两个参数默认值都是被关闭的，后者 recyle 比前者 reuse 要温柔一些。另外，如果使用 tcp_tw_reuse，必需设置 tcp_timestamps=1，否则无效。这里，你一定要注意，打开这两个参数会有比较大的坑，可能会让 TCP 连接出一些诡异的问题（因为如上述一样，如果不等待超时重用连接的话，新的连接可能会建不上。正如官方文档上说的一样“It should not be changed without advice/request of technical experts”）。

**关于 tcp_tw_reuse。** 官方文档上说 tcp_tw_reuse 加上 tcp_timestamps（又叫 PAWS, for Protection Against Wrapped Sequence Numbers）可以保证协议的角度上的安全，但是你需要 tcp_timestamps 在两边都被打开（你可以读一下 tcp_twsk_unique 的源码 ）。我个人估计还是有一些场景会有问题。

**关于 tcp_tw_recycle。** 如果是 tcp_tw_recycle 被打开了话，会假设对端开启了 tcp_timestamps，然后会去比较时间戳，如果时间戳变大了，就可以重用。但是，如果对端是一个 NAT 网络的话（如：一个公司只用一个 IP 出公网）或是对端的 IP 被另一台重用了，这个事就复杂了。建链接的 SYN 可能就被直接丢掉了（你可能会看到 connection time out 的错误）（如果你想观摩一下 Linux 的内核代码，请参看源码 tcp_timewait_state_process）。

**关于 tcp_max_tw_buckets。** 这个是控制并发的 TIME_WAIT 的数量，默认值是 180000，如果超限，那么，系统会把多的给 destory 掉，然后在日志里打一个警告（如：time wait bucket table overflow），官网文档说这个参数是用来对抗 DDoS 攻击的。也说的默认值 180000 并不小。这个还是需要根据实际情况考虑。

再次提醒，使用 tcp_tw_reuse 和 tcp_tw_recycle 来解决 TIME_WAIT 的问题是非常非常危险的，因为这两个参数违反了 TCP 协议（RFC 1122）

其实，TIME_WAIT 表示的是你主动断连接，所以，这就是所谓的“不作死不会死”。试想，如果让对端断连接，那么这个破问题就是对方的了，呵呵。另外，如果你的服务器是 HTTP 服务器，那么设置一个 HTTP 的 KeepAlive 有多重要（浏览器会重用一个 TCP 连接来处理多个 HTTP 请求），然后让客户端去断链接（你要小心，浏览器可能会非常贪婪，他们不到万不得已不会主动断连接）。
