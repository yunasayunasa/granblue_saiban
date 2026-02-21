; siete_scenario.ks

*deck_scene_start
[chara_new name="oigen" storage="oigen_normal.png" jname="オイゲン"] 
[chara_new name="siete" storage="siete_normal.png" jname="シエテ"]
[chara_face name="siete" face="normal" storage="siete_normal.png"] 
[chara_face name="siete" face="stance" storage="siete_stance.png"] 
[chara_face name="siete" face="granchariot" storage="siete_granchariot.png"] 
; ★★★ 六竜のファイル名も _normal を付けることを推奨 ★★★
[chara_new name="wilnas" storage="wilnas_normal.png" jname="ウィルナス"]
[chara_new name="luoh" storage="luoh_normal.png" jname="ルオー"]
[chara_new name="wamdus" storage="wamdus_normal.png" jname="ワムデュス"]
[chara_new name="galleon" storage="galleon_normal.png" jname="ガレヲン"]
; data/fgimage/oigen_normal.png を用意
; 背景を甲板に変更
[bg storage="deck_bg.jpg" time="1000"]

    [chara_show name="siete" x="150" y="150" time="500" wait="true"]
; シエテが表示されている状態 (first.ksから引き継ぎ、またはここで再表示)
; [chara_show name="siete" x="150" y="150"] ; 必要であれば表示位置を再調整

君はシエテと共に甲板に出た。[p]

#シエテ
チョコを受け取れる世界と言っても、[r]
団長ちゃんなら引く手数多でしょ？[p]
ここで待っててもいいんじゃないかな？[p]

それとも...、[r]
１つ手合わせでもしながら暇を潰すかい？[l]
#
; 選択肢
[glink  text="静かに待つ" target="*wait_quietly"]
[glink  text="手合わせする" target="*spar_with_siete"]
[s]

*wait_quietly
    ; 「静かに待つ」を選んだ場合の展開
    君は静かに待つことにした。[p]
#
    静かに━[p]
    ...ヤッ！[p]
    ......ソイヤッ！[p]
    静かに...待[p]
    ソイヤッ！ソイヤッ！[p]
      ; ★★★ シエテを一旦消す (3人組を目立たせるため) ★★★
    [chara_hide name="siete" time="200" wait="true"]

    ; ★★★ 三人組を登場させる ★★★
    ; 位置は仮です。画面サイズ (450x800) に合わせて、3人が重ならず、
    ; かつ暑苦しい感じが出るように配置を調整してください。
    ; 例: 左からジン、中央にソリッズ、右にオイゲン
   
    [chara_show name="oigen" x="150" y="150" time="300" wait="true"] 
      ; ★★★ 画面揺らし演出 ★★★
    [quake time="500" count="3" hmax="15" vmax="15" wait="false"]
    ; time: 揺れる合計時間 (ミリ秒)
    ; count: 揺れる回数 (指定しないと揺れ続けるので注意)
    ; hmax: 横揺れの最大幅 (ピクセル)
    ; vmax: 縦揺れの最大幅 (ピクセル)
    ; wait: 揺れが終わるまで待つか (true/false)
#三羽烏
    ; ★★★ 「ソイヤアアアアアアアアアッッッッ！！！！！」の文字を太く大きく 
    [playse storage="smash.mp3" stop="false"]

    [font size="40" bold="true" color="red"]
    「「「ソイヤアアアアアアアアアッッッッ！！！！！」」」[p]
    [resetfont] 
#
    君の前に3人の暑苦しい男が現れた。[p] 
#
    君は...[l]

    ; 次の選択肢
    [glink  text="ソイヤッ！" target="*soiya_with_them"]
    [glink  text="うるさい！" target="*scold_them"]
    [s]

*spar_with_siete 
    ; [playse storage="select_se.wav"] 
    ; シエテが表示されている状態
     [chara_show name="siete" face="normal" x="150" y="150" time="300" wait="true"]
#
    君はシエテと手合わせする事にした。[p]
       [playbgm storage="battle.mp3" loop="true"]
     
    ; face="normal" で通常立ち絵に戻す (もし前のシーンで別の表情になっていたら)
    ; time="0" で瞬時に表示 (再挑戦なのでフェードインなどは不要かもしれません)
    ; x,y はシエテの基本表示位置
 [chara_mod name="siete" face="stance" time="300"] 
    #シエテ
    さて、君がどれほど強くなったか[r]
    見せてもらうよ。[p]
    まずはコレでどうかな！[p]
#
    シエテが右上段から斬り掛かる。[l]

    君は...[l]

    ; 選択肢
    [glink   text="左に避ける" target="*spar_dodge_left"]
    [glink  text="剣で受ける" target="*spar_block_sword_badend"] 
    [glink  text="右に避ける" target="*spar_block_sword_badend"] 
    [s]

*spar_block_sword_badend 
 [stopbgm] 
    ; [playse storage="select_se.wav"]
    [chara_hide name="siete" time="200" wait="true"] 
    君は、暗闇から目を覚ました。[r]
    どうやら気絶していたらしい。[p]

    [chara_show name="siete" x="150" y="150" time="500" wait="true"] 
    #シエテ
    ごめん！団長ちゃん！[r]
    団長ちゃんならこれぐらいなら大丈夫と思って、[r]
    強く打ち込みすぎちゃった！[r]
    本当ごめんね！[p]
#
    ベッドの横の時計を見ると、[r]
    既に0時を回っていた。[p]
    バレンタインは、終わったのだ。[p]

    BAD END [p]

    ; ロジャー登場
    [chara_hide name="siete" time="200" wait="true"]
    [chara_show name="roger" x="150" y="150" time="500" wait="true"]
    #ロジャー
    ありゃ！バレンタインおわちゃた！[r]
    再演算再演算！[p]
    [chara_hide name="roger" time="500" wait="true"]

    [jump target="*spar_with_siete"] 

*spar_dodge_left 
    ; [playse storage="select_se.wav"]
    ; シエテが表示されている状態 (通常顔のままか、少し驚いた表情差分があればそれも良い)
#
    君は左に避けた。[p]
    すかさず打ち込むが、[r]
    シエテには容易に防がれる。[p]

    ; ★★★ シエテのポーズ変更 ★★★
    [chara_mod name="siete" face="stance" time="300"] 

    #シエテ
    いいね！さぁ団長ちゃんの番だ！[r]
    かかって来なさい！[p]
#
    君は...[l]

    ; 次の選択肢
    [glink  text="横一文字に斬り掛かる" target="*spar_block_sword_badend"] 
    [glink  text="大きくジャンプして斬り掛かる" target="*spar_block_sword_badend"] 
    [glink  text="後の先を取る為に斬りかからない" target="*spar_dont_attack"]
    [s]

*spar_dont_attack 
    ; [playse storage="select_se.wav"]
    ; シエテは stance のポーズのまま

    君は剣を構えた。[p]

    #シエテ
    へぇ...、そういう手で来るんだね。[r]
    いいよ。じゃあ...[p]

    「本気、出しちゃおっかな。」[p]

     ; ★★★ グランシャリオ発動演出 (画像なしバージョン) ★★★

    ; --- 溜め開始 ---
    ; [playse storage="charge_start_se.wav"] 
    [chara_mod name="siete" face="granchariot" time="300"] 
    [quake time="1000" count="5" hmax="5" vmax="5" wait="false"] 
#
    天星剣王の髪が蒼く染まる。[r]
    途方もない剣気が集まるのが分かる。[p]
    ; [wait time="500"]


体の震えが告げている。[r]
まともに受ければ、死だと。[p]

; [stopse]

; --- 発動 ---
#シエテ
「グラン•シャリオ」[p]
 [playse storage="smash.mp3" stop="false"]
; [playse storage="granchariot_slash_se.wav"]
[quake time="800" count="10" hmax="30" vmax="30" wait="false"]


#
    君は...[l]

    ; 次の選択肢
    [glink  text="ガードで受け止める！" target="*spar_block_sword_badend"] 
    [glink  text="一か八かで突っ込む！" target="*spar_block_sword_badend"] 
    [glink  text="チョコあげる！" target="*spar_give_choco_siete_end"]
    [s]

*spar_give_choco_siete_end 
    ; [playse storage="select_se.wav"]
    ; シエテは granchariot の立ち絵のままか、ここで通常顔に戻すか
   

    君はチョコを差し出した。[p]

    #シエテ
    グランシャリ...[p]
  [chara_mod name="siete" face="normal" time="300"] 
    [playbgm storage="ending_bgm.mp3" loop="true"]
    え？俺に？[r]
    くれるのかい？ありがとう、団長ちゃん！[p]
    とても嬉しいよ！[p]

    あ、そうだ。お返ししなくちゃね。[r]
    はい、コレ！十天衆チョコ！[p]
#
    シエテからチョコを受け取った。[p]
    ...中にはデフォルメされたシエテのシールと共に、[r]
    ウエハースチョコが入っていた。[p]

    #シエテ
    お！俺だね！レア物だよ〜？[r]
    大事にしてね！[p]
#
    ━すっかり気が抜けてしまった君とシエテは、[r]
    十天衆チョコを開けまくり、[r]
    無事全種コンプリート出来たのであった。[p]

    ～シエテEND～[l]
    [chara_hide name="siete" time="500" wait="true"]
    [jump storage="first.ks" target="*start"]


*soiya_with_them 
    ; [playse storage="select_se.wav"] 

    ; 3人組は表示されたまま（またはここで再度表示位置などを調整）
    ; 必要であれば、シエテを再表示して困惑させるセリフを追加しても面白い

    君は彼らと共にソイヤッ！する事にした。[p]

#四羽烏
    ソイヤッ！[p]
   
    ソイヤッ！ソイヤッ！[p]

   
   
    ソイヤソイヤソイヤソイヤッ！[p]
    [chara_hide name="oigen" time="100" wait="true"]

    ; 全員でソイヤ (ここは地の文や、特別な演出で)
    「ソイヤッサ！」[p]
    [font size="35" bold="true"]
    「「「「ソイヤッ！ソイヤッ！ソイヤッサ！！」」」」[p]
    [resetfont]

    ; シエテ登場（または再登場）
  
    [chara_hide name="oigen" time="100" wait="false"]
    [chara_show name="siete" x="150" y="150" time="500" wait="true"]
    #シエテ
    えぇ...？何...これ...？[p]
    え？コレで終わり！？[r]
    嘘でしょ！？[p]
#
    ━ソイヤの魅力には誰も抗えない。[p]
    ～ソイヤッ！END～[l]

    [chara_hide name="siete" time="500" wait="true"]
    [jump storage="first.ks" target="*start"] 


*scold_them 
    ; [playse storage="select_se.wav"]

    君は彼らにうるさいと注意した。[p]

    ; 3人組が悲しむ演出 (表情差分があれば [chara_mod] で変更)
    ; ここではセリフのみで表現
    ; 必要であれば、[chara_move] などで退場する動きをつけても良い
    
    #三羽烏
    ｿｲﾔｧ...(´；ω；`)[p]
    [chara_hide name="oigen" time="500" wait="true"] 
#
    肩を落とし船内に戻っていく3人を見送りながら、[r]
    君は静かに待つ。[p]

    ; シエテを表示したままにするか、ここで再表示するか
    ;[chara_show name="siete" x="150" y="150" time="300" wait="true"] 

    そこに現れたのは...[l]

    ; 次の選択肢
    [glink  text="ウィルナス、ルオー" target="*wilnas_luoh_appear"]
    [glink  text="ワムデュス、ガレヲン" target="*wamdus_galleon_appear"]
    [s]

*wilnas_luoh_appear
    ; [playse storage="select_se.wav"] ; 選択音
    ; シエテは表示されたままか、一旦消して六竜を目立たせるか
    [chara_hide name="siete" time="200" wait="true"]

   

    現れたのは六竜のウィルナスとルオーだった。[p]
#
    ; ウィルナス表示 (立ち絵ができたら)
     [chara_show name="wilnas" x="100" y="150" time="500" wait="true"]
    #ウィルナス
    重畳！重畳！[r]
    ここにいやがりやがったか！[p]
     [chara_hide name="wilnas" time="200" wait="true"]

    ; ルオー表示 (立ち絵ができたら)
     [chara_show name="luoh" x="200" y="150" time="500" wait="true"] 
    #ルオー
    探していたのだよ。[r]
    これを渡す為に。[p]
     [chara_hide name="luoh" time="200" wait="true"]
#
    2人はその手に綺麗にラッピングされた包みを[r]
    持っている。[l]

    君は...[l]

    ; 次の選択肢
    [glink  text="ウィルナスから受け取る" target="*receive_from_wilnas_end"]
    [glink  text="ルオーから受け取る" target="*receive_from_luoh_end"]
    [s]

*wamdus_galleon_appear
    ; [playse storage="select_se.wav"]
    [chara_hide name="siete" time="200" wait="true"]

   

    現れたのは六竜のワムデュスとガレヲンだった。[p]

    ; ワムデュス表示
     [chara_show name="wamdus" x="100" y="150" time="500" wait="true"]
    #ワムデュス
    特異点、探した。[r]
    これあげる。ロジャーに作ってもらった。[p]
     [chara_hide name="wamdus" time="200" wait="true"]

    ; ガレヲン表示
     [chara_show name="galleon" x="200" y="150" time="500" wait="true"]
    #ガレヲン
    賞賛。(この空の世界で生きる全ての命に[r]
    幸いあれ。無論、特異点にも。[r]
    これをどうぞ)[p] 
     [chara_hide name="galleon" time="200" wait="true"]
#
    2人は綺麗なラッピングがなされた包みを[r]
    差し出した。[l]

    君は...[l]

    ; 次の選択肢
    [glink  text="ワムデュスから受け取る" target="*receive_from_wamdus_end"]
    [glink  text="ガレヲンから受け取る" target="*receive_from_galleon_end"]
    [s]


; ----- 以下、各六竜からのチョコ受け取りとエンディング -----

*receive_from_wilnas_end
    ; ウィルナスから受け取った (ウィルナスEND)
     [chara_show name="wilnas" x="150" y="150"] 
    君はウィルナスから受け取った[p]
[playbgm storage="ending_bgm.mp3" loop="true"]
    #ウィルナス
    喝采！喝采！[r]
    さぁくらいやがるといい！[p]

    ; ルオーのセリフ (ルオー表示)
     [chara_hide name="wilnas"]
      [chara_show name="luoh" x="150" y="150"]
    #ルオー
    くっ...！[r]
    あんな石炭の方がいいというのかね...！[p]
    [chara_hide name="luoh"]
#
    包みを開けると、暗黒を昏く塗り潰した[r]
    闇の塊が入っていた。[p]

     [chara_show name="wilnas" x="150" y="150"] 
    #ウィルナス
    実食、実食！[r]
    ぜひ感想を鼎に聞かせやがるといい！[p]
#
    意を決して口に含むと、[r]
    闇の塊よりも深い深淵が目の前を覆った。[p]
    次に目覚めたのは、一週間後の事だった...。[p]
    ～ウィルナスEND～[l]
     [chara_hide name="wilnas"]
    [jump storage="first.ks" target="*start"]


*receive_from_luoh_end
    ; ルオーから受け取った (ルオーEND)
     [chara_show name="luoh" x="150" y="150"] 
    君はルオーから受け取った。[p]
[playbgm storage="ending_bgm.mp3" loop="true"]
    #ルオー
    先に言っておくがね、[r]
    空の民の味覚は六竜である私にはわからない。[p]
    だか、それでもなるべくは寄せたつもりだ。[p]
    それ以上に、こういう催事は[r]
    気持ちが大事なのだろうという事も想像はつく。[p]
    まぁつまりは、、、[l]
    ハッピーバレンタイン。[p]

    ; ウィルナスのセリフ (ウィルナス表示)
     [chara_hide name="luoh"] 
     [chara_show name="wilnas" x="150" y="150"]
    #ウィルナス
    ハッピー、ハッピー！[r]
    バレやがるタイン！[p]
     [chara_hide name="wilnas"]
#
    チョコレートは、非常に美味だった。[p]
    それはつまり、それだけの努力と[r]
    空の民への興味。[p]
    そして、特異点たる存在への、[r]
    せめてもの慈悲であった。[p]
    ～ルオーEND～[l]
     
     [chara_hide name="luoh"]
    [jump storage="first.ks" target="*start"]


*receive_from_wamdus_end
    ; ワムデュスから受け取った (ワムデュスEND)
    [playbgm storage="ending_bgm.mp3" loop="true"]
     [chara_show name="wamdus" x="150" y="150"] 
    君はワムデュスから受け取った。[p]
    同時にワムデュスの腹部から[r]
    空虚の音が聞こえてくる。[p]

    #ワムデュス
    ワム、お腹すいた...。[p]
#
    それならばと、受け取ったチョコを渡そうとするが、[r]
    それをシエテが制する。[p]

    ; シエテ登場
     [chara_hide name="wamdus"]
    [chara_show name="siete" x="150" y="150"]
    #シエテ
    じゃあ、みんなでこれ食べよう！[r]
    十天衆チョコ！[r]
    まだまだたくさんあるからね！[p]
    [chara_hide name="siete"]

    ; ワムデュス再表示
     [chara_show name="wamdus" x="150" y="150"]
    #ワムデュス
    ...！食べる。[r]
    みんなで食べるの、楽しい。[r]
    特異点も、楽しい？[p]
#
    君は笑顔で頷く。[p]
    団員達と笑顔で食卓を囲む、その日が、[r]
    旅の終わりまで続くことを祈りながら━[p]
    ～ワムデュスEND～[l]
     [chara_hide name="wamdus"]
    [jump storage="first.ks" target="*start"]


*receive_from_galleon_end
    ; ガレヲンから受け取った (ガレヲン
    [playbgm storage="ending_bgm.mp3" loop="true"]

     [chara_show name="galleon" x="150" y="150"] 
    君はガレヲンから受け取った。[p]

    #ガレヲン
    密作。(昨年は先に贈り物を聞いたので、[r]
    今回は秘密に用意しました。)[p]
    期待。(喜んでくれると嬉しいのですが。)[p]
#
    包みを開けると中には、[r]
    岩の塊のようなものが入っていた。[p]

    #ガレヲン
    縮尺。(ミニチュアサイズの島です。[r]
    もちろん、植物も、鉱物も。[r]
    この空の世界をそこに再現しました。)[p]
#
    六竜の超然とした感覚に驚かされる。[p]
    苦笑いを浮かべながらも、[r]
    君は礼を言うのであった。[p]

    その岩の塊に潜む、[r]
    緋緋色の輝きを見つけるのは、[r]
    また別のお話━[p]
    ～ガレヲンEND～[l]
     [chara_hide name="galleon"]
    [jump storage="first.ks" target="*start"]
; 以下、ウィルナス・ルオー登場ルート、ワムデュス・ガレヲン登場ルート、
; そして「手合わせする」を選んだ場合のルートを記述していきます。
; *wilnas_luoh_appear
; *wamdus_galleon_appear
; *spar_with_siete
;   *dodge_left (避けた後の次の選択肢など)
;   *block_sword
;   *dodge_right

; エンディングの最後には [jump storage="first.ks" target="*start"] でプロローグへ戻る