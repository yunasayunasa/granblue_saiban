; fenny_scenario.ks

*port_breeze_arrival
    ; フェニーは表示されている状態
    [bg storage="port_breeze_bg.jpg" time="1000"] 
    [playbgm storage="cafe.mp3" loop="true"]
    君は、フェニーと共にとりま突発で[r]
    ポートブリーズに向かうことにした。[p]

; ----- キャラクター定義 (このファイルで使うキャラ) -----
[chara_new name="hauhet" storage="hauhet_normal.png" jname="ハウヘト"]
[chara_new name="sabrina" storage="sabrina_normal.png" jname="サブリナ"]
[chara_new name="ruria" storage="ruria_normal.png" jname="ルリア"]
[chara_new name="sandalphon" storage="sandalphon_normal.png" jname="サンダルフォン"]
 [chara_face name="fenny" face="smile" storage="fenny_smile.png"] 
  [chara_new name="ronpa" storage="ronpa_cutin.png" jname="論破"]
  [chara_new name="matta" storage="matta_cutin.png" jname="待った"]
  [chara_new name="igiari" storage="igiari_cutin.png" jname="異議あり"]
    #フェニー
    サブリナにチョコを渡したくて、[r]
    その為の器材や材料が買いたいんだよ！[p]
    どっちを先に買いに行ったほうがいいかな？[l]

    ; 選択肢
    [glink color="blue"   text="器材を買いに行く" target="*buy_equipment_route"]
    [glink color="blue"   text="材料を買いに行く" target="*buy_ingredients_route"]
    [s]


; ----- 材料ルート -----
*buy_ingredients_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="shop_bg.jpg" time="1000"] 
    [chara_show name="sabrina" x="150" y="150"] 
    #サブリナ
    お、フェニー！団長と買い物？[p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"] 
    #フェニー
    ま、まずいんだよ！[r]
    サブリナにチョコを渡す計画がバレちゃうんだよ！[p]
    団長さん！なんとかしてぇ！[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" x="150" y="150"]
    #サブリナ
    なーにをこそこそと相談してるんだい？[r]
    聞かせなさい！[p]
#
    このままでは計画がバレてしまう...[l]
    君は...[l]

    ; 選択肢
    [glink color="blue"  size="24" text="ごまかす！" target="*ingredients_deceive"]
    [glink color="blue"  size="24" text="フェニーにまかせる！" target="*ingredients_leave_to_fenny_badend"]
    [s]

*ingredients_leave_to_fenny_badend
    [chara_hide name="sabrina" time="200" wait="true"]
    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    ふぇぇ！なんとかして欲しいのは[r]
    フェニーの方なんだよ！？[p]
    で、でも、団長さんがいうなら、[r]
    なんとかしてみるんだよ！[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" x="150" y="150"]
    #サブリナ
    何か悩みがあるならなんでも言って。[r]
    ようやく一緒にいられるんだから...[p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    サブリナ！[r]
    実はその...団長さんとデート中なんだよ！[p]
    [chara_hide name="fenny" time="200" wait="true"]
 [stopbgm] 
    [chara_show name="sabrina" x="150" y="150"]
    #サブリナ
    は！？[p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    だから...その...邪魔しないで欲しいんだよ！！！[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="sabrina" x="150" y="150"]
    #サブリナ
    団長...。どういうこと？[r]
    ちょっとあっちで"お話"しようか...[p]
    [chara_hide name="sabrina" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    あ、、あれ？なんか不穏なんだよ...？[p]
    [chara_hide name="fenny" time="200" wait="true"]
#
    その後、君の行方を知るものは誰もいなかった...[p]
    ～バッドエンド～[l]
    [jump storage="first.ks" target="*start"] 

*ingredients_deceive
[chara_hide name="sabrina" time="200" wait="true"]
    [bg storage="cafe_bg.jpg" time="1000"] 
    なんとかサブリナをごまかし、[r]
    退散することができた君たちは、[r]
    カフェのキッチンでチョコの制作に取り掛かった。[p]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    〜♪〜♪サブリナ喜んでくれるかなぁ？[p]
#
    金色に輝くボウルを混ぜながら、チョコを作るフェニー。[p]
    見守っていると、自然と口元が綻んでくる。[p]
    すると...[p]

    #フェニー
    ああーーーーー！！！[r]
    チョコが、チョコがなくなってるんだよ！！？[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" x="150" y="150"]
    #ルリア
    え、ええーーー！！[r]
    ソ、ソンナ、イッタイダレガー！[p]
#
    あからさまに動揺しているルリア。[r]
    まさかこれは...[p]
    [chara_hide name="ruria" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    ...ルリア？ルリアなんだよ？[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" x="150" y="150"]
    #ルリア
    ち、違います！[r]
    私じゃありません！話を聞いて下さい！[p]
#
    どうやら証言を聞く必要があるようだ。[p]
    君はルリアの証言を聞くことにした。[p]
[font color="yellow"]
        [playbgm storage="ronpa_bgm.mp3" loop="true"] 
    これよりアンストッパブル議論が始まります。[p]
    リアルタイムで切り替わるルリアの証言には矛盾が含まれています。[p]
    これまでのシナリオは覚えていますね？[p]
    下のボタンから正しいコトダマを矛盾した証言のタイミングでタップ。[r]
    正解すればシナリオが進行します。[p]
    ルリアも必死です。[r]5回間違えるとバッドエンドとなります。[p]
    貴方様なら、必ず矛盾を指摘できると信じています…。[l][p]
 [resetfont]
    ; ★★★ ノンストップ議論パートへジャンプ ★★★
    [jump  target="*start_debate"]

  *start_debate
    [cm]
    [clearfix]
    ;[bg storage="courtroom_bg.jpg" time="500"]
    @layopt layer=message0 visible=false
      [eval exp="f.life = 5"]

    ; ★★★ 議論用の変数を最初に全て初期化 ★★★
    [iscript]
    f.debate_statements = [
        { id: 1, text: "フェニーちゃんのチョコはここにあります！", is_weakpoint: false },
        { id: 2, text: "サンダルフォンさんが用意したこの銀の器材の中です！", is_weakpoint: true },
        { id: 3, text: "ヘラもちゃんと用意してくれました！", is_weakpoint: false },
        { id: 4, text: "ハウヘトさんから何か受け取ってましたけど、それが何だっていうんですか！", is_weakpoint: false }
    ];
    f.kotodama_list = [
        { id: "hera", name: "サンダルフォンのヘラ" },
        { id: "hihiiro", name: "ヒヒイロボウル" } // 正解
    ];
    f.debate_index = 0;
    f.is_debate_active = true;
      f.is_debate_finished = false;
  
    [endscript] 
   

   ; ★★★ 最初のUI配置 ★★★
    [chara_show name="ruria" x="150" y="100"]
    [ptext name="testimony_text" layer="0" x="50" y="300" width="350" height="150" size="28" color="white" border="line" border_color="red" border_size="2"]
    [glink name="kotodama_hera" text="&f.kotodama_list[0].name" x="20" y="650" width="100" size="20" color="green" target="*on_shot_hera"]
    [glink name="kotodama_hihiiro" text="&f.kotodama_list[1].name" x="230" y="650" width="100" size="20" color="green" target="*on_shot_hihiiro"]
     
    [jump target="*debate_loop"]
    [s]
*debate_loop
    ; 議論が終了していたら、このループを抜ける
    [if exp="f.is_debate_active == false"]
        [jump target="*debate_end_processing"]
    [endif]

    ; ★★★ 毎回UIを再描画する（念のため）★★★
    [chara_show name="ruria" x="150" y="100" time="0"] 
    [ptext name="testimony_text" layer="0" x="50" y="300" width="350" height="150" size="28" color="white"]
    [glink name="kotodama_hera" text="&f.kotodama_list[0].name" x="20" y="650" width="100" size="20" color="green" target="*on_shot_hera"]
    [glink name="kotodama_hihiiro" text="&f.kotodama_list[1].name" x="230" y="650" width="100" size="20" color="green" target="*on_shot_hihiiro"]

    ; ★★★ 表示する証言の情報を変数に格納 ★★★
    [iscript]
    var current_statement = f.debate_statements[f.debate_index];
    f.current_text = current_statement.text;
    f.is_weakpoint_now = current_statement.is_weakpoint;
    f.debate_index = (f.debate_index + 1) % f.debate_statements.length;
   
    [endscript]
    
    
    ; ★★★ ptextの更新とアニメーションを連続実行 ★★★
    ; 最初にテキスト内容を更新
    [ptext name="testimony_text" text="&f.current_text" overwrite="true"layer="0" x="50" y="300" width="350" height="150" size="30" color="yellow" bold="true" border="line" border_color="red" border_size="2"]
    
   
    [wait time="2000"]
    [jump target="*debate_loop"]
    [s]

; ----- コトダマボタンが押された時の中継ラベル -----
*on_shot_hera
    [eval exp="f.shot_kotodama_id = 'hera'"]
    [jump target="*check_shot_action"]
*on_shot_hihiiro
    [eval exp="f.shot_kotodama_id = 'hihiiro'"]
    [jump target="*check_shot_action"]

*check_shot_action
    ; [playse storage="shoot_se.wav"]

    [if exp="f.is_weakpoint_now == true && f.shot_kotodama_id == 'hihiiro'"]
        ; 正解！
        [eval exp="f.is_debate_active = false"] 
        ; ループ停止フラグを立てる
        [jump target="*debate_success"]

    
    [ptext name="life_gauge" layer="fix" x="350" y="20" size="24" color="white" text="体力："&f.life]
   
   
       
            [jump target="*debate_fail_message"]
        
    [endif]
    [s]
    *debate_fail_message
     [eval exp="f.life--"]
    @layopt layer=message0 visible=true
    #ルリア
    はわわ〜、よく分かりませんでしたぁ。[l]もう一回最初から言いますね？[p]

 [if exp="f.life <= 0"]
        [jump target="*ruria_investigation_badend"]
[endif]
    @layopt layer=message0 visible=false
    [eval exp="f.debate_index = 0"]
    [jump target="*debate_loop"]

*debate_success
[stopbgm]
[playse storage="ronpa.mp3" stop="true"] 
 [image storage="ronpa_cutin.png" layer="0" x="0" y="100" time="10" wait="false"]
    [cm]
    [clearfix]
    [free name="testimony_text" layer="0"]
    [free name="kotodama_hera"layer="0"]
    [free name="kotodama_hihiiro"layer="0"]
     ; ★★★ 「論破！」演出 ★★★
    [stopbgm time="500"] 
    
    [quake time="500" count="5" hmax="20" vmax="20" wait="false"] 
    
   
    [wait time="1500"] 
    [freeimage layer="0" time="300"]
     [chara_hide name="ronpa" time="0" wait="true"]
    ; ★★★ 演出ここまで ★★★

    ; [playbgm storage="success_bgm.ogg"] 
    @layopt layer=message0 visible=true
    [chara_hide name="ruria" time="200" wait="true"]
   [chara_show name="fenny" x="150" y="150"]
   # フェニー
    [playse storage="smash.mp3" stop="false"]
それは違うんだよ！！[p]
フェニーが使ってたのはヒヒイロボウル！[r]
ハウヘトが用意してくれた最高級品なんだよ！！[p]
 [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="hauhet" x="150" y="150"]
#ハウヘト
ふふ...すごいのよ、アレ。[p]
[chara_hide name="hauhet" time="200" wait="true"]
 [chara_show name="ruria" x="150" y="150"]
#ルリア
そ、そんな...[p]
ご、ごめんなさい〜！！[r]
つい、魔が刺してしまって...[p]
 [chara_hide name="ruria" time="200" wait="true"]
  [chara_show name="sabrina" x="150" y="150"]
  [playbgm storage="ending_bgm.mp3" loop="true"]
#サブリナ
お？今度はキッチンで何してるんだい？[p]
[chara_hide name="sabrina" time="200" wait="true"]
[chara_show name="fenny" x="150" y="150"]
#フェニー
サブリナ！まだこっち来ちゃダメなんだよ！[p]
 [chara_hide name="fenny" time="200" wait="true"]

 [chara_show name="sabrina" x="150" y="150"]
#サブリナ
さっきもなんかゴチャゴチャいって誤魔化されたけど、一体何してんのさ...[r]
この香りはチョコ？[p]
[chara_hide name="sabrina" time="200" wait="true"]
 [chara_show name="hauhet" x="150" y="150"]
#ハウヘト
もういいんじゃないかしら？[r]
みんなで作った方がきっと楽しいわよ？[p]
[chara_hide name="hauhet" time="200" wait="true"]
[chara_show name="fenny" x="150" y="150"]
#フェニー
あうぅ...、サブリナ、実はね？[p]
 [chara_hide name="fenny" time="200" wait="true"]
#
全ての話を聞いたサブリナは豪快に笑い飛ばした。[p]
 [chara_show name="sabrina" x="150" y="150"]
#サブリナ
あっはっは！そんな可愛いことを考えてたの？[p]
...考えることは同じだね。[r]
みんなで一緒に作ろっか？[p]
ルリアも！そんな隅っこで何してんのさ！こっち来なよ![p]
[chara_hide name="sabrina" time="200" wait="true"]
 [chara_show name="fenny" face="smile" x="150" y="150"]
#フェニー
みんなで作るんだよ！[p]
 [chara_hide name="fenny" face="smile"time="200" wait="true"]
 [chara_show name="hauhet" x="150" y="150"]
#ハウヘト
こんな事もあろうかと、シェロカルテさんから最高級の金剛晶カカオを買い付けてるわ、[r]何がすごいってこのカカオは油分がお肌に抜群にいいのそれに...[p]
[chara_hide name="hauhet" time="200" wait="true"]
 [chara_show name="ruria" x="150" y="150"]
#ルリア
わぁっ...！すごいです〜！[r]
あなたも一緒に作りましょう！[p]
 [chara_hide name="ruria" time="200" wait="true"]
#
君は、みんなと共にチョコを作り始めた。[r]
誰かを想い、誰かに想われたチョコはそこにしかない格別な味がした。[p]

〜ジュウダンロンパエンド〜[l]

    [jump storage="first.ks" target="*start"]

*debate_end_processing
    ; タイムアップなどで議論が終了した場合の処理
    ; 今回は成功時しか来ないが、念のため
    @endjump



; ----- 器材ルート -----
*buy_equipment_route
    [chara_hide name="fenny" time="200" wait="true"]
    [bg storage="shop_bg.jpg" time="1000"]
    君は先に器材を買いに行くことにした。[p]

    [chara_show name="hauhet" x="150" y="150"]
    #ハウヘト
    あら...特異点。あなたも買い物？[p]
    [chara_hide name="hauhet" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    ハウヘト！ハウヘトも買い物なんだよ？[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="hauhet" x="150" y="150"]
    #ハウヘト
    えぇ、ここの店はポートブリーズでも特に質が良いの。[p]
    この店にはよく来るから、[r]
    何か聞きたいことがあれば[r]
    アドバイスできると思うわよ？[p]
    [chara_hide name="hauhet" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    団長さん！[r]
    ハウヘトなら色々目利きが効くかもなんだよ！[p]
    買い物のアドバイスしてもらおう？[l]
#
    ; 選択肢
    [glink color="blue"  size="24" text="受ける" target="*equipment_ask_hauhet_end"]
    [glink color="blue"   size="24" text="受けない" target="*equipment_decline"]
    [s]

*equipment_ask_hauhet_end
    [chara_hide name="fenny" time="200" wait="true"]
    [chara_show name="hauhet" x="150" y="150"]
    #ハウヘト
    チョコを手作りするのね。[p]
    そうね、ならやはりボウルとヘラは妥協出来ないわ。[p]
熱伝導効率を最大に高めるためにはこのヒヒイロボウル！[r]
これは良いものよ...。[p]
ヒヒイロカネはその希少性から市場にほぼ出回ることはないわ[r]
だからこそそれを贅沢に使ったこのヒヒイロボウルはそんじょそこらの金属製ボウルとはまた違った
圧倒的な熱伝導効率でチョコを溶かすことができるの[p]
そしてこのダマスカスヘラは4凸済み！これこそが一流の仕事これこそが...[p]
    [chara_hide name="hauhet" time="200" wait="true"]
    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    なんか...すっごい早口で[r]
    何言ってるか全然わかんないんだよ...[p]
    [chara_hide name="fenny" time="200" wait="true"]
#
    その後閉店時間まで延々と[r]
    ハウヘトの講釈を聞く羽目になった...[p]
    チョコ作りは当然間に合わなかった。[p]
    ～ハウヘトEND～[l]
    [jump storage="first.ks" target="*start"]

*equipment_decline
    [bg storage="cafe_bg.jpg" time="1000"]
    買い物を終えた君たちは、[r]
    船内のカフェのキッチンでチョコを作り始めた。[p]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    〜♪〜♪サブリナ、喜んでくれるかなあ？[p]
#
    鼻歌を歌いながら楽しそうにチョコを作るフェニー。[p]
    見ているこちらも顔が綻んでくる。[p]
    すると...[p]

    #フェニー
    ああーーーーー！！！[r]
    チョコが、チョコがなくなってるんだよ！！？[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" x="150" y="150"]
    #ルリア
    ええーーーー！！[r]
    ソ、ソンナ...イッタイダレガー...[p]
#
    一緒に見守っていたはずのルリアが[r]
    明らかに動揺している...[p]
    これは...[p]
    [chara_hide name="ruria" time="200" wait="true"]

    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    ...ルリア？ルリアなんだよ？[p]
    [chara_hide name="fenny" time="200" wait="true"]

    [chara_show name="ruria" x="150" y="150"]
    #ルリア
    ち、違います！私じゃありません！[r]
    アリバイだってあります！[p]
    それに！しょ、証拠がありません！[p]
#
    どうやらシラを切るつもりらしい。[p]
    このままでは埒が開かない。[p]
    君はルリアの証言を聞くことにした。[l][p]
[font color="yellow"]
        [playbgm storage="gyakuten_bgm.mp3" loop="true"]
    これより逆転追及裁判が始まります。[p]
    ルリアの証言には矛盾が含まれています。[p]
    まずはルリアの証言を"ゆさぶり"ましょう。[p]
    これまでのシナリオや、揺さぶった証言から情報を得て、[r]
    矛盾した証言に正しい証拠品を突き付けてください。[p]
    正解すればシナリオが進行します。[p]
    ルリアも必死です。[r]5回間違えるとバッドエンドとなります。[p]
    貴方様なら、必ず矛盾を指摘できると信じています…。[l][p]
 [resetfont]
    ; ★★★ 逆転裁判パートへジャンプ ★★★
    

*start_cross_examination
    [cm]
    [clearfix]
    ; [playbgm storage="cross_examination_bgm.ogg"]

    ; ★★★ 初期設定は体力のみ ★★★
    [eval exp="f.life = 5"]

    [chara_show name="ruria" x="150" y="100"]

    ; --- 最初の証言表示 ---
    [jump target="*show_all_testimonies"]


*show_all_testimonies
    #ルリア
    そ、そうです！聞いてください！[r]
    これが私のアリバイです！[p]

    [font color="yellow"]
    証言１：わ、私じゃありません！[p]
    証言２：私はあなたと一緒にフェニーちゃんを見守ってたじゃないですか！[p]
    証言３：フェニーちゃんは黙々とチョコを作ってたのを私も見てます！[p]
    証言４：ほら！ちゃんとフェニーちゃんが何してたかも分かります！[p]
    [resetfont]

    [jump target="*main_interrogation_choice"]


*main_interrogation_choice
    ; 体力表示
    [ptext name="life_gauge" layer="0" x="350" y="20" size="24" color="white" text="体力："&f.life]

    #
    どうする？[p]

    [glink text="ゆさぶる"  target="*select_testimony_for_shake"]
    [glink text="つきつける"  target="*select_testimony_for_present"]
    [glink text="もう一度聞く"  target="*show_all_testimonies"]
    [s]


; ----- 「ゆさぶる」の証言選択 -----
*select_testimony_for_shake
    #
    （どの発言をゆさぶろうか…）[l]
    [glink text="証言１"  target="*shake_testimony_1"]
    [glink text="証言２"  target="*shake_testimony_2"]
    [glink text="証言３"  target="*shake_testimony_3"]
    [glink text="証言４"  target="*shake_testimony_4"]
    [glink text="やめる"  color="gray" target="*main_interrogation_choice"]
    [s]

*shake_testimony_1
 ; ★★★ 「待った！」演出 ★★★
    [playse storage="matta.mp3" stop="false"]
    [image storage="matta_cutin.png" layer="0" x="10" y="200" time="100" wait="false"] 
 ;   [chara_show name="matta" x="150" y="150" time="10"]
    [wait time="800"] 
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="matta" time="0" wait="true"]
    ; ★★★ 演出ここまで ★★★
    #ルリア
    ま、まだ証言を始めたばかりです！ちゃんと話を聞いてください！[p]
    [jump target="*main_interrogation_choice"]
*shake_testimony_2
; ★★★ 「待った！」演出 ★★★
    [playse storage="matta.mp3" stop="false"]
    [image storage="matta_cutin.png" layer="0" x="10" y="200" time="100" wait="false"] 
    ; [chara_show name="matta" x="150" y="150" time="10"]
    [wait time="800"] 
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="matta" time="0" wait="true"]
    #ルリア
    フェニーちゃんが何をしてたかって？それはもちろんチョコ作りです！[p]
    [jump target="*main_interrogation_choice"]
*shake_testimony_3
; ★★★ 「待った！」演出 ★★★
   [playse storage="matta.mp3" stop="false"]
    [image storage="matta_cutin.png" layer="0" x="10" y="200" time="100" wait="false"] 
   ;  [chara_show name="matta" x="150" y="150" time="10"]
    [wait time="800"] 
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="matta" time="0" wait="true"]
    #ルリア
    黙々と黙ってたかって...？ええ！そうです！真剣な顔で作ってましたよ！鼻歌一つ歌ってません！[p]
    [jump target="*main_interrogation_choice"]
*shake_testimony_4
; ★★★ 「待った！」演出 ★★★
    [playse storage="matta.mp3" stop="false"]
    [image storage="matta_cutin.png" layer="0" x="10" y="200" time="100" wait="false"] 
   ;  [chara_show name="matta" x="150" y="150" time="10"]
    [wait time="800"] 
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="matta" time="0" wait="true"]
    #ルリア
    だから、私は犯人じゃないんです！信じて下さい！[p]
    [jump target="*main_interrogation_choice"]


; ----- 「つきつける」の証言選択 -----
*select_testimony_for_present
    #
    （どの発言に証拠品をつきつけようか…）[l]
    [glink text="証言１"   target="*present_to_wrong_testimony"] 
    [glink text="証言２"   target="*present_to_wrong_testimony"] 
    [glink text="証言３"  target="*present_to_testimony_3_correct"] 
    [glink text="証言４"   target="*present_to_wrong_testimony"] 
    [glink text="やめる"  color="gray" target="*main_interrogation_choice"]
    [s]

*present_to_wrong_testimony 
    [jump target="*show_evidence_selection_fail"]

*present_to_testimony_3_correct
    [jump target="*show_evidence_selection_correct"] 


; ----- 証拠品選択 -----
*show_evidence_selection_correct
    #
    （どの証拠品を使おうか…）[l]
    [glink text="フェニーの鼻歌" color="green" target="*ruria_breakdown_success"] 
    [glink text="口元のチョコ"    color="green" target="*present_fail"]
    [glink text="ヒヒイロボウル"  color="green" target="*present_fail"]
    [glink text="やめる"   color="gray" target="*main_interrogation_choice"]
    [s]

*show_evidence_selection_fail 
    #
    （どの証拠品を使おうか…）[l]
    [glink text="フェニーの鼻歌"  color="green" target="*present_fail"]
    [glink text="口元のチョコ"   color="green" target="*present_fail"]
    [glink text="ヒヒイロボウル"  color="green" target="*present_fail"]
    [glink text="やめる"  color="gray" target="*main_interrogation_choice"]
    [s]

*present_fail
 ; ★★★ 「異議あり！」演出 ★★★
   [image storage="igiari_cutin.png" layer="0" x="10" y="100" time="10" wait="false"]
    
   [playse storage="igiari.mp3" stop="false"] 
    [wait time="800"] 
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="igiari" time="0" wait="true"]
    ; ★★★ 演出ここまで ★★★
     #
 異議あり！その証言、[r]この証拠品と矛盾する！[l][p]
    [eval exp="f.life--"]
    [ptext name="life_gauge" layer="fix" x="350" y="20" size="24" color="white" text="体力："&f.life]
    [if exp="f.life <= 0"]
        [jump target="*ruria_investigation_badend"]
    [else]
        #ルリア
        そ、そんなの証拠になりません！[p]
        [jump target="*main_interrogation_choice"]
    [endif]
    [s]

*ruria_breakdown_success
[stopbgm]
 ; ★★★ 「異議あり！」演出 ★★★
    [playse storage="igiari.mp3" stop="false"]
    [image storage="igiari_cutin.png" layer="0" x="10" y="100" time="10" wait="false"]
     [stopbgm] 
    [wait time="800"] 
    [quake time="300" count="3"]
    [freeimage layer="0" time="200"] 
[chara_show name="ruria"time="0" x="150" y="150"]
     [chara_hide name="igiari" time="0" wait="true"]
    [freeimage layer="0" time="200"]
    ; ★★★ 演出ここまで ★★★
    [cm]
    [clearfix]
    [chara_hide name="ruria"]
    ; [playbgm storage="success_bgm.ogg"]
    [chara_show name="ruria" x="150" y="100"]
    #
    [playse storage="smash.mp3" stop="false"]
    異議あり！[r]
    その時フェニーは楽しそうに鼻歌を歌っていた！[p]
    この証言は…！[p]
     [playse storage="smash.mp3" stop="false"]
     [quake time="300" count="3"]
    [font size="50" color="red" bold="true"]
    矛盾している！[p]
    [resetfont]
    #ルリア
    え...！？フェニーちゃんは[r]
    鼻歌を歌っていた...？[p]
    う、嘘ですよね？[p]

    [chara_hide name="ruria" time="200" wait="true"]
    [chara_show name="sandalphon" x="150" y="150" time="500" wait="true"]
    #サンダルフォン
    間違いないな。[r]
    俺も奥でコーヒーの配合をしてたが、[r]
    あれは間違いなくフェニーだった。[p]
    [chara_hide name="sandalphon" time="200" wait="true"]

    [chara_show name="ruria" x="150" y="100" time="500" wait="true"]
    #ルリア
    そ、そんな...[r]
    ご、ごめんなさい〜！[p]
    美味しそうでつい、[r]
    魔が刺しちゃって...[p]

    [chara_hide name="ruria" time="200" wait="true"]
    [chara_show name="fenny" x="150" y="150"]
       [playbgm storage="ending_bgm.mp3" loop="true"]
    #フェニー
    大丈夫なんだよ！[r]
    こんなこともあろうかと、[r]
    いーーっぱい！チョコは買ってきてあるんだよ！[p]
    さ！気を取り直して一緒に作るんだよ！！[p]
    [chara_hide name="fenny"]

    #
    君は矛盾を指摘できた。[p]
    チョコをもらったサブリナの笑顔、[r]
    チョコをあげたフェニーの笑顔、[r]
    共にかけがえのない宝を守ることができた君は━[p]

    [chara_show name="fenny" face="smile" x="150" y="150"]
   
    #フェニー
    はい！団長さんにも！[r]
    ハッピーバレンタインなんだよ！[p]
    [chara_hide name="fenny"]

    #
    無事、チョコを手に入れることができた。[p]
    ～逆転追求裁判エンド～[l]
    [jump storage="first.ks" target="*start"]

*ruria_investigation_badend
     [cm]
    [clearfix]
    [free name="testimony_text" layer="0"]
    [free name="kotodama_hera"layer="0"]
    [free name="kotodama_hihiiro"layer="0"]
    @layopt layer=message0 visible=true
   
    ; [playbgm storage="bad_end_bgm.ogg"]
 [stopbgm] 
    #ルリア
    ほら！何度やっても同じです！[r]
    ね？私は食べていないでしょう？[p]
    チョコは無くなっちゃいましたが...[p]
    美味しかったからしょうがないですよ！[l][p]

    [chara_hide name="ruria" time="200" wait="true"]
    [chara_show name="fenny" x="150" y="150"]
    #フェニー
    サブリナ...ごめんなんだよ...[l][p]
    [chara_hide name="fenny"]

    #
    君は矛盾を指摘できなかった。[p]
    チョコもフェニーの笑顔も守れなかった敗北者として、[r]
    君の名は歴史に刻まれた。[p]
    ～バッドエンド～[l]
    [jump storage="first.ks" target="*start"]
