; siete_scenario.ks - エンジン用に変換
; シエテルート

; 動的アセット宣言
@asset type=image key=roger_normal path=assets/images/roger_normal.png

*deck_scene_start
    ; キャラクター定義
    [chara_new name="roger" jname="ロジャー"]
    [chara_new name="fenny" jname="フェニー"]
    [chara_new name="narumia" jname="ナルメア"]
    [chara_new name="siete" jname="シエテ"]

    ; 背景を甲板に変更
    [bg storage="bgtest" time="1000"]
    [playbgm storage="cafe" loop="true"]

    #
    君はシエテと共に甲板に出た。
    [p]

    #シエテ
    チョコを受け取れる世界と言っても、
    [p]
    団長ちゃんなら引く手数多でしょ？
    [p]
    ここで待っててもいいんじゃないかな？
    [p]

    それとも...、
    [p]
    １つ手合わせでもしながら暇を潰すかい？
    [l]

    #
    ; 選択肢
    [link target="*wait_quietly" text="静かに待つ"]
    [link target="*spar_with_siete" text="手合わせする"]
    [r]
    [s]

*wait_quietly
    ; 「静かに待つ」を選んだ場合
    君は静かに待つことにした。
    [p]

    #
    静かに━
    [p]
    ...ヤッ！
    [p]
    ......ソイヤッ！
    [p]
    静かに...待
    [p]
    ソイヤッ！ソイヤッ！
    [p]

    [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
    [playse storage="smash" stop="false"]

    #三羽烏
    「「「ソイヤアアアアアアアアアッッッッ！！！！！」」」
    [p]

    #
    君の前に3人の暑苦しい男が現れた。
    [p]

    君は...
    [l]

    ; 次の選択肢
    [link target="*soiya_with_them" text="ソイヤッ！"]
    [link target="*scold_them" text="うるさい！"]
    [r]
    [s]

*spar_with_siete
    #
    君はシエテと手合わせする事にした。
    [p]
    [playbgm storage="bgm_action" loop="true"]

    #シエテ
    さて、君がどれほど強くなったか
    [p]
    見せてもらうよ。
    [p]
    まずはコレでどうかな！
    [p]

    #
    シエテが右上段から斬り掛かる。
    [p]

    君は...
    [l]

    ; 選択肢
    [link target="*spar_dodge_left" text="左に避ける"]
    [link target="*spar_block_sword_badend" text="剣で受ける"]
    [link target="*spar_block_sword_badend" text="右に避ける"]
    [r]
    [s]

*spar_block_sword_badend
    [stopbgm]

    #
    君は、暗闇から目を覚ました。[br]どうやら気絶していたらしい。
    [p]

    ごめん！団長ちゃん！[br]団長ちゃんならこれぐらいなら大丈夫と思って、[br]強く打ち込みすぎちゃった！[br]本当ごめんね！
    [p]

    #
    ベッドの横の時計を見ると、[br]既に0時を回っていた。[br]バレンタインは、終わったのだ。
    [p]

    BAD END
    [p]

    ; ロジャー登場
    [chara_show name="roger" storage="roger_normal" pos="center" time="500" wait="true"]
    #ロジャー
    ありゃ！バレンタインおわちゃた！
    [p]
    再演算再演算！
    [p]
    [chara_hide name="roger" time="500" wait="true"]

    [jump target="*spar_with_siete"]

*spar_dodge_left
    #
    君は左に避けた。
    [p]
    すかさず打ち込むが、
    [p]
    シエテには容易に防がれる。
    [p]

    #シエテ
    いいね！さぁ団長ちゃんの番だ！
    [p]
    かかって来なさい！
    [p]

    #
    君は...
    [l]

    ; 次の選択肢
    [link target="*spar_block_sword_badend" text="横一文字に斬り掛かる"]
    [link target="*spar_block_sword_badend" text="大きくジャンプして斬り掛かる"]
    [link target="*spar_dont_attack" text="後の先を取る為に斬りかからない"]
    [r]
    [s]

*spar_dont_attack
    #
    君は剣を構えた。
    [p]

    #シエテ
    へぇ...、そういう手で来るんだね。
    [p]
    いいよ。じゃあ...
    [p]

    「本気、出しちゃおっかな。」
    [p]

    ; グランシャリオ発動演出
    [quake time="1000" count="5" hmax="5" vmax="5" wait="false"]

    #
    天星剣王の髪が蒼く染まる。
    [p]
    途方もない剣気が集まるのが分かる。
    [p]

    体の震えが告げている。
    [p]
    まともに受ければ、死だと。
    [p]

    #シエテ
    「グラン•シャリオ」
    [p]
    [playse storage="smash" stop="false"]
    [quake time="800" count="10" hmax="30" vmax="30" wait="false"]

    #
    君は...
    [l]

    ; 次の選択肢
    [link target="*spar_block_sword_badend" text="ガードで受け止める！"]
    [link target="*spar_block_sword_badend" text="一か八かで突っ込む！"]
    [link target="*spar_give_choco_siete_end" text="チョコあげる！"]
    [r]
    [s]

*spar_give_choco_siete_end
    #
    君はチョコを差し出した。
    [p]

    #シエテ
    グランシャリ...
    [p]
    [playbgm storage="night_bgm" loop="true"]
    #シエテ
    え？俺に？[br]くれるのかい？ありがとう、団長ちゃん！[br]とても嬉しいよ！
    [p]

    あ、そうだ。お返ししなくちゃね。[br]はい、コレ！十天衆チョコ！
    [p]

    #
    シエテからチョコを受け取った。[br]...中にはデフォルメされたシエテのシールと共に、[br]ウエハースチョコが入っていた。
    [p]

    #シエテ
    お！俺だね！レア物だよ〜？[br]大事にしてね！
    [p]

    #
    ━すっかり気が抜けてしまった君とシエテは、[br]十天衆チョコを開けまくり、[br]無事全種コンプリート出来たのであった。
    [p]

    ～シエテEND～
    [l]
    [jump storage="TitleScene"]
    [s]


*soiya_with_them
    #
    君は彼らと共にソイヤッ！する事にした。
    [p]

    #四羽烏
    ソイヤッ！
    [p]
    ソイヤッ！ソイヤッ！
    [p]
    ソイヤソイヤソイヤソイヤッ！
    [p]

    ; 全員でソイヤ
    「ソイヤッサ！」
    [p]
    「「「「ソイヤッ！ソイヤッ！ソイヤッサ！！」」」」
    [p]

    #シエテ
    えぇ...？何...これ...？
    [p]
    え？コレで終わり！？
    [p]
    嘘でしょ！？
    [p]

    #
    ━ソイヤの魅力には誰も抗えない。
    [p]
    ～ソイヤッ！END～
    [l]
    [jump storage="TitleScene"]
    [s]


*scold_them
    #
    君は彼らにうるさいと注意した。
    [p]

    #三羽烏
    ｿｲﾔｧ...(´；ω；`)
    [p]

    #
    肩を落とし船内に戻っていく3人を見送りながら、
    [p]
    君は静かに待つ。
    [p]

    そこに現れたのは...
    [l]

    ; 次の選択肢
    [link target="*wilnas_luoh_appear" text="ウィルナス、ルオー"]
    [link target="*wamdus_galleon_appear" text="ワムデュス、ガレヲン"]
    [r]
    [s]

*wilnas_luoh_appear
    #
    現れたのは六竜のウィルナスとルオーだった。
    [p]

    #ウィルナス
    重畳！重畳！
    [p]
    ここにいやがりやがったか！
    [p]

    #ルオー
    探していたのだよ。
    [p]
    これを渡す為に。
    [p]

    #
    2人はその手に綺麗にラッピングされた包みを
    [p]
    持っている。
    [l]

    君は...
    [l]

    ; 次の選択肢
    [link target="*receive_from_wilnas_end" text="ウィルナスから受け取る"]
    [link target="*receive_from_luoh_end" text="ルオーから受け取る"]
    [r]
    [s]

*wamdus_galleon_appear
    #
    現れたのは六竜のワムデュスとガレヲンだった。
    [p]

    #ワムデュス
    特異点、探した。
    [p]
    これあげる。ロジャーに作ってもらった。
    [p]

    #ガレヲン
    賞賛。(この空の世界で生きる全ての命に
    [p]
    幸いあれ。無論、特異点にも。
    [p]
    これをどうぞ)
    [p]

    #
    2人は綺麗なラッピングがなされた包みを
    [p]
    差し出した。
    [l]

    君は...
    [l]

    ; 次の選択肢
    [link target="*receive_from_wamdus_end" text="ワムデュスから受け取る"]
    [link target="*receive_from_galleon_end" text="ガレヲンから受け取る"]
    [r]
    [s]


; ----- 各六竜エンディング -----

*receive_from_wilnas_end
    #
    君はウィルナスから受け取った
    [p]
    [playbgm storage="night_bgm" loop="true"]

    #ウィルナス
    喝采！喝采！
    [p]
    さぁくらいやがるといい！
    [p]

    #ルオー
    くっ...！
    [p]
    あんな石炭の方がいいというのかね...！
    [p]

    #
    包みを開けると、暗黒を昏く塗り潰した
    [p]
    闇の塊が入っていた。
    [p]

    #ウィルナス
    実食、実食！
    [p]
    ぜひ感想を鼎に聞かせやがるといい！
    [p]

    #
    意を決して口に含むと、[br]闇の塊よりも深い深淵が目の前を覆った。[br]次に目覚めたのは、一週間後の事だった...。
    [p]
    ～ウィルナスEND～
    [l]
    [jump storage="TitleScene"]
    [s]


*receive_from_luoh_end
    #
    君はルオーから受け取った。
    [p]
    [playbgm storage="night_bgm" loop="true"]

    #ルオー
    先に言っておくがね、
    [p]
    空の民の味覚は六竜である私にはわからない。
    [p]
    だか、それでもなるべくは寄せたつもりだ。
    [p]
    それ以上に、こういう催事は
    [p]
    気持ちが大事なのだろうという事も想像はつく。
    [p]
    まぁつまりは、、、
    [l]
    ハッピーバレンタイン。
    [p]

    #ウィルナス
    ハッピー、ハッピー！
    [p]
    バレやがるタイン！
    [p]

    #
    チョコレートは、非常に美味だった。[br]それはつまり、それだけの努力と[br]空の民への興味。[br]そして、特異点たる存在への、[br]せめてもの慈悲であった。
    [p]
    ～ルオーEND～
    [l]
    [jump storage="TitleScene"]
    [s]


*receive_from_wamdus_end
    [playbgm storage="night_bgm" loop="true"]
    #
    君はワムデュスから受け取った。
    [p]
    同時にワムデュスの腹部から
    [p]
    空虚の音が聞こえてくる。
    [p]

    #ワムデュス
    ワム、お腹すいた...。
    [p]

    #
    それならばと、受け取ったチョコを渡そうとするが、
    [p]
    それをシエテが制する。
    [p]

    #シエテ
    じゃあ、みんなでこれ食べよう！
    [p]
    十天衆チョコ！
    [p]
    まだまだたくさんあるからね！
    [p]

    #ワムデュス
    ...！食べる。
    [p]
    みんなで食べるの、楽しい。
    [p]
    特異点も、楽しい？
    [p]

    #
    君は笑顔で頷く。[br]団員達と笑顔で食卓を囲む、その日が、[br]旅の終わりまで続くことを祈りながら━
    [p]
    ～ワムデュスEND～
    [l]
    [jump storage="TitleScene"]
    [s]


*receive_from_galleon_end
    [playbgm storage="night_bgm" loop="true"]
    #
    君はガレヲンから受け取った。
    [p]

    #ガレヲン
    密作。(昨年は先に贈り物を聞いたので、
    [p]
    今回は秘密に用意しました。)
    [p]
    期待。(喜んでくれると嬉しいのですが。)
    [p]

    #
    包みを開けると中には、
    [p]
    岩の塊のようなものが入っていた。
    [p]

    #ガレヲン
    縮尺。(ミニチュアサイズの島です。
    [p]
    もちろん、植物も、鉱物も。
    [p]
    この空の世界をそこに再現しました。)
    [p]

    #
    六竜の超然とした感覚に驚かされる。[br]苦笑いを浮かべながらも、[br]君は礼を言うのであった。
    [p]

    その岩の塊に潜む、[br]緋緋色の輝きを見つけるのは、[br]また別のお話━
    [p]
    ～ガレヲンEND～
    [l]
    [jump storage="TitleScene"]
    [s]
```
