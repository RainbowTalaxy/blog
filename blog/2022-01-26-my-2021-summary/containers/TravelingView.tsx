import Emoji from '@site/src/components/Emoji';
import React from 'react';
import styled from 'styled-components';
import { Card, Image, Keyword, Paragraph, Primary, ProgressItemTitle } from '../components';
import ProgressView, { ProgressItem } from '../components/ProgressLine';

interface Props {}

const Container = styled.div``;

const ImageGroup = styled.div`
    display: flex;
    flex-wrap: wrap;
    align-items: flex-start;
    padding: 0 5px;
    width: calc(100% + 20px);
    transform: translateX(-10px);

    > div {
        display: block;
        margin: 0 5px 13px;
        flex: 1;
        min-width: 250px;
        max-width: min(50vh, 350px);
    }
`;

const TravelingView = ({}: Props) => {
    return (
        <Container>
            <ProgressView topSpace={75}>
                <ProgressItem>
                    <ProgressItemTitle>这一年，我在南京的许多地方...</ProgressItemTitle>
                </ProgressItem>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 3 月 24 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>南京植物园（南园）</Keyword>
                <Card>
                    <Paragraph>
                        和舍友一起去南京植物园玩。当时搞错了，应该去北区而不是南区玩的：
                    </Paragraph>
                    <ImageGroup>
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEBFH.T1Oa94QZ1Cd4IkEGb1QeNRSzvB.mHQ0I51M832jocXokIvJben3a03*TKr62Qc7Le*FQg0*9k5fiKQ7lEo!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrENO6XT4UWj.qzqTth*7IQ7lJhVzdDAi1ikdzqBsunJHVT2jTlpYrs1Jd2OKHxRisy7oDcFGDXwrna41HwyZnWb4!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEP1LsVNj4y5WnO0rYfZMJq9zVY846Xrzye4ZpLH61S0VNMvuH1v2vgC7y5FRMXNypgY2Xp4k.kLeBhD5cAsFQKY!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEBe4RfmBDsMgwDVh50XhBwlWc.*08QSwUtCku*0irALEpkAI6acFQWcdzbWntAXzpVVGVoDYDYvRTEmfxAuSyC0!/b&bo=VQhABsAP0AsBaUE!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 4 月 4 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>凤凰广场、玄武湖等</Keyword>
                <Card>
                    <Paragraph>和朱老板一起去的，主要是赏樱：</Paragraph>
                    <ImageGroup>
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrECLdVGj57kNJl0.NdRBLK8*YEEHi8NSho.k.8AqHiF4FKGWFUAopd*FB7hfL7kL8TtylXRUKH3gyDP2mzkbOtkw!/b&bo=VQhABsAP0AsBSWE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEEO5jltsXRdJ3TP9vsUh*Nxm88Gcqmjb9a0iqQ9SzrXSc*s6upSES6vt.Y3hhENF72MN3ac0xPm7MhC1uQJF3JY!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEIzTbSQnHMEMWDmmPvTIGtQqMXLL8dWciFGOCguzB0aQ**Ej0u6z16cfPhl2w*LaB8Y6Rp1DmvnRetkMGFWsDFo!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEK5fWIisbUiFrAcRLLFcQUpiSvY6oA9lUKBEcXmTAltSoFM19U2qqimEGznTjyi.*63xePKuZvMDsEHV1bWG.Ec!/b&bo=VQhABsAP0AsBSWE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEL5Dpl5EpLFMjIOBFns6AuHb*IITbVyruNiIiYxbpAlYPCvbv53Lj1Xv1OOT8e8kNfUMhbITBQr5g*iJ2Qi25GA!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrED9ZATSJRluz5tvwUp.DOlIudYrjg*h3i7T8Jm3R1oUyBoOj5.WBLrhu.V90XQ.8eaIVmQqgt8sDJgcOXL0Z69s!/b&bo=VQhABsAP0AsBKQE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrECyLXIXwrvBYa9dBFJMHlvOkcv.UkCZhxg*IvgwqtKRgKPmaJ8XysKCZ0MOpLEh8NKBCtMji2G17EM57NX9BZu4!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrENyZRisZ4HUDKuIX1h7tFV5ltZ9wm9NZrdL1cSJxl61oPh2MFwdlBG*LdM1PaWfSCfWZPt.NwiI5x6wJdo5NqbE!/b&bo=VQhABsAP0AsBSWE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEGUqY*iy1EdQ0KAgzkHknhu8y1wYG3aMxfDNGKzgag4GOQkcnxwhTUzt5r0YC8hRqIoHqLcAU8gC6I2VVmWmZq8!/b&bo=QAZVCMAP0AsBKQE!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 4 月 28 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>国际博览中心、南京眼、南京长江大桥等</Keyword>
                <Card>
                    <Paragraph>还是和朱老板一起去的，路线是这样：</Paragraph>
                    <Paragraph>
                        <Primary>下午出发</Primary> → <Primary>元通地铁站</Primary> →{' '}
                        <Primary>国际博览中心</Primary> → <Primary>南京眼</Primary> →{' '}
                        <Primary>江心洲地铁站</Primary> → <Primary>浦口公园</Primary> →{' '}
                        <Primary>南京北站</Primary> → <Primary>桥北滨江公园</Primary> →{' '}
                        <Primary>南京长江大桥</Primary> → <Primary>回校</Primary>
                    </Paragraph>
                    <Paragraph>
                        印象深刻的还属骑车过南京长江大桥 <Emoji symbol="👍" /> 。
                    </Paragraph>
                    <ImageGroup>
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEFWpnWmw5TOARYLFYZKH316bIxk4DJnA5lDhFFcV8l5IJTeQDpeePz7BgcEbu5eaH3yodiCEMfC8gZv0WBHI.54!/b&bo=QAZVCMAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEMj7KduwxU96hEa0rbMXfT.jEH9Daz8cDS2MRIWmEof3vS55BmbwyYse9akKoB3TNPp6fO3Pr6U*nI8m13Fg4r8!/b&bo=QAZVCMAP0AsBGTE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrELMkMUCAAPikbN6zH6uMu5mC4nUx5*wXKHCCqZ.S88dDEq5LN0uMyh29O8HCZGdlHsctnqtzZJeGPMvXEBqSV*g!/b&bo=VQhABsAP0AsBWXE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEL8OsJx2yw5vVZQ*Q6AlYEduDqJUIZcxEgyURQjrP6XgR2hRaZe*IJdxUbdwq6g7d*LFgWmLU7fVs*9VfEXshvU!/b&bo=VQhABsAP0AsBKQE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEEBxNt4ifIWWO6Px6tovW7qdT9zvRtDbvUs4LN*GLc7Rw9VSlEORJLOw3GKTGCctgEj8eYPncfr52lETMqr4Cic!/b&bo=VQhABsAP0AsBGTE!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 10 月 6 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>灵谷景区</Keyword>
                <Card>
                    <Paragraph>
                        当时本来想去闻桂花香的，结果还没到盛开期（被微博热搜骗了）。
                    </Paragraph>
                    <ImageGroup>
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEMYkt5cT.pOs39zWDHDXez8sqEt6HmaZcRAyV3POw3L4LoANByoXF6Pr17nBnTIqPbFXxxnJFXbqkgXnJVvD7vE!/b&bo=VQhABsAP0AsBaUE!&rf=viewer_4" />
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEHaYAzVKzREseMQgOE16r43g48D14WHl08t9iWcEL0cfPax8MPZknXo1t3wKEW*CFja2XWUZybeSuy.56qABWM4!/b&bo=VQhABsAP0AsBaUE!&rf=viewer_4" />
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEEZeGiKJstlx8MenGNX4pfpQ4WVozCsX9HGjzjRn0c7i9a285DAKSVYuoeT7LLS14N8E71uoe7KtJxvIQDI.Pbo!/b&bo=VQhABsAP0AsBaUE!&rf=viewer_4" />
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEJjhQYTycDkDZzWWHUbEApBMPn1zCmjPOnfvZWUeSP3Li4xKxUQaGpkY3vw3LfhQpR7B*JOSwKBlqxN6rnMRWs8!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEAV*wTZXAbN2DPHRMkRDEq.9xLfose2dVfNd4Odc0pL665Q4LwvVMU9BhzqZgzkZoVkJPjxxfpnDVzyL9ZR2s5A!/b&bo=VQhABsAP0AsBSWE!&rf=viewer_4" />
                        <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEDBLOJK8FFDVmbB0wrvFWu*U4*PXGHRsHrWpINjKpDUnQyZCIynUwXJVeZx*2XPudSFksN6jFDx0vl36*0qx6Xg!/b&bo=VQhABsAP0AsBGTE!&rf=viewer_4" />
                    </ImageGroup>
                    <Paragraph>
                        站在灵谷塔上，可以看到南京天际线。当时我头一次看到光泻下来的景色。
                    </Paragraph>
                    <Image src="http://photogz.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEO*NSUXxC3vbegw9T8ff2RplPVc56AdQMSi5oYyTbSrZzrrHK5OOGTlniTycNF*3M6S3QQk8TlAdgoGd5f1VHcI!/b&bo=VQhABsAP0AsBGTE!&rf=viewer_4" />
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 10 月 30 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>紫金山</Keyword>
                <Card>
                    <Paragraph>当时马哥从杭州回来，同老胡、朱老板聚聚。走了超长的山路。</Paragraph>
                    <Paragraph>图一是从天文台拍的玄武湖；图二是在紫金山顶拍的。</Paragraph>
                    <ImageGroup>
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEBgaGlwdfqP8STKjcGGgIh4d1r2PYq6d6Yv6Sik1um0uBaF6hqde8QabePYmBRzZ8rQ1SgY..2wzG0sUVy7qxl0!/b&bo=VQhABsAP0AsBKQE!&rf=viewer_4" />
                        <Image src="http://photonj.photo.store.qq.com/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEK7mvqsFLOuGDBQ79LlHsjui1GhJm8TMR.Jku6vGW*KioSP0lmZ1vfv3FLRRhym6Dk2mSuNsKsl9mN5vD0PRyoA!/b&bo=VQhABsAP0AsBGTE!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 11 月 6 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>红山动物园</Keyword>
                <Card>
                    <Paragraph>入职前一个周末去的。听说新馆开了才去的。</Paragraph>
                    <ImageGroup>
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEOlVDgm.DDldMN2B6b0.l81IzBW5SeU4NTw2rbfgvNu7.tmKxAnnJds2*PPlYbIH*G66NzQ9.AhSI4JDwb3*o04!/b&bo=VQhABsAP0AsBORE!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEPhkaRjUJ3SXi*yjqzpEk5iXcoLQoi3NDvTe*nIG8u1a0Db7t6XMh8X*t2i7snjB7yOc5P09Dia9L2xqpem77co!/b&bo=VQhABsAP0AsBSWE!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEGljqr7rvRenrrT1Q0W78rl1L7*NAfCl.VSE9Y9fX8Xu8s.qz5Vxy4KHVWcyvmwBJ4vy530rc87OHFqyGj4mj9U!/b&bo=VQhABsAP0AsBaUE!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEH*HGaRPTGugHVMd54HK*XwyhFpt00JcHyK2SGhqO*vTVyd9wbqTy0PIhEjkcOe5dMbEE2Bw2aLFAmRs3E6gepQ!/b&bo=VQhABsAP0AsBKQE!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
                <ProgressItem>
                    <ProgressItemTitle>2021 年 12 月 26 日</ProgressItemTitle>
                </ProgressItem>
                <Keyword>梅花谷、明孝陵</Keyword>
                <Card>
                    <Paragraph>可能是南京最冷的一天，也是最干净的一天。</Paragraph>
                    <ImageGroup>
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEKqALGGoGBoL.a3*ifIzUncQ6h9Z6AMTymM4Dxmz1X0S5rj3YP6EwMn*Gtswo8KSTrhToomB4FniA46OlRSAWHs!/b&bo=WghABiASkA0BGYU!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEBRlLWNX21cMWI2aGJplz4qcGhhPycte2PfC7MJLdg9zeBD7GkqhQ5HW7eF129DRmpFssxlWDVeJudPUSqM8JhE!/b&bo=WghABiASkA0BafU!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrEJJU3n4OYkDwjnaKLCKY7OB79NDzb4sxkf3NieqvHykkSGT2pGAGLOy5N0U.q*rOx5NsJBLlRFR0nFIT*Avyfx4!/b&bo=WghABiASkA0BWcU!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrELboHX5yXVe4Ay*eVCO92pPMBBjxVNjYQ2JzcUA6G*uvj2f7c5.Zt6bGWBM07GLQfjdSL*n01PUSCj5SAXijOKE!/b&bo=WghABiASkA0BafU!&rf=viewer_4" />
                        <Image src="http://m.qpic.cn/psc?/V12to3FW3aSvFz/TmEUgtj9EK6.7V8ajmQrECV4jTe9m9MOge.R54BGbbDL3WnEhZfq4gs1yDZPSEeuDhdf3pAXjf1hv8z3Y*fbQEfc8jJ7TeaMCYllt4m.7nw!/b&bo=QAZaCJANIBIBSdU!&rf=viewer_4" />
                    </ImageGroup>
                </Card>
            </ProgressView>
        </Container>
    );
};

export default TravelingView;
